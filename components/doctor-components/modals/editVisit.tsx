import CustomModal from "@/components/common-components/CustomModal"
import { useSessionUser } from "@/components/context/Session";
import { PatientModel } from "@/components/models/patient";
import { LabResultsModel, VisitModel } from "@/components/models/visitModel";
import { Box, useMediaQuery } from "@mui/material";
import { Button, DatePicker, Divider, Form, Input, message, Popover, Row, Spin, Steps, Upload, UploadProps } from "antd";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { VisitCard } from "@/appPages/doctor/ActiveVisits";
import { ExperimentOutlined, LoadingOutlined, MedicineBoxOutlined, MinusCircleOutlined, UploadOutlined} from '@ant-design/icons';
import { batchUpload } from "@/utils/batchFileUpload";
import { useEffect, useState } from "react";
import { cloudinaryPresents } from "@/data/constants";
import { useDrugInteractionMutation, useUpdatePatientMedicalConditionMutation, useUpdateVisitMutation } from "@/redux/api/doctorApi";
import dayjs from "dayjs";
import { useStepsForm } from 'sunflower-antd';
import { DoctorModel } from "@/components/models/doctor";


interface props{
    open:boolean,
    setOpen:(value:boolean)=>void,
    visit:VisitCard,
    selectedPatient:PatientModel,
}

export const EditVisitModal = ({open,visit,selectedPatient,setOpen}:props)=>{
    const {user}:{user?:DoctorModel} = useSessionUser();
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    const [updateVisit] = useUpdateVisitMutation();
    const [updatePatientMedicalCondition] = useUpdatePatientMedicalConditionMutation();
    const [labResultImgs,setLabResultImgs] = useState<File[]>([]);
    const [submitLoading,setSubmitLoading] = useState(false);
    const [drugInteraction] = useDrugInteractionMutation();
    const [drugLoading,setDrugLoading] = useState<{[key:string]:boolean}>({});
    const [ddLoading,setDdLoading] = useState<boolean>(false);
    const [dd_interactionMsg,setDd_InteractionMsg] = useState<{interaction:string,message:string,index?:number}|null>(null);
    const [md_interactionMsg,setMd_InteractionMsg] = useState<{interaction:string,message:string,index?:number}[]|null>(null);


    const {
        form,
        current,
        gotoStep,
        stepsProps,
        formProps,
        submit,
    } = useStepsForm({
        async submit(value: any) {

            setSubmitLoading(true);
            const {preferredDate,medicalConditions,...values} = value;

            let labResults:LabResultsModel[]= [];
            if(labResultImgs.length){
                const labResultImages = await batchUpload(labResultImgs,cloudinaryPresents.PATIENT_LAB_RESULT);
                if(labResultImages){
                    const labRes = form.getFieldValue('labResults')??[];
                    labRes.map((result:any,index:number)=>{
                        labResults.push({
                            testName: result.testName??'not specified',
                            result: (labResultImages as string[])?.at(index)??'',
                            normalRange: "xx",
                            unit: "xx"
                        } as LabResultsModel)
                    })
                }else{
                    message.error('Unable to upload lab results');
                    setSubmitLoading(false);
                    return;
                }
            }

            const visitData: VisitModel = {
                ...values,
                approval: 'Approved',
                ...(labResults.length?{labResults}:{}),

                patient: visit.patient,
                doctor:visit.doctor,
                preferredDate: visit.preferredDate,
            } as VisitModel;

            
            
            try {
                const mcs = medicalConditions?.map((mc:any)=>mc.condition)??[];

                if(JSON.stringify(selectedPatient.medicalConditions)!=JSON.stringify(mcs) && mcs.length){
                    await updatePatientMedicalCondition({patientId: selectedPatient._id, medicalConditions:mcs}).unwrap();

                }
                await updateVisit({visitID: visit._id,body: visitData}).unwrap();

                message.success("Visit edited");
                form.resetFields();
                setLabResultImgs([]);
                setOpen(false);
            } catch (error: any) {
                console.log(error)
                message.error("Something went wrong, please try again");
            }finally{
                setSubmitLoading(false);
            }
        },
        total: 2,
    });

    const onFinish = async ()=>{
        await submit()
    }

    const beforeUpload: UploadProps['beforeUpload'] = (file) => {
        const isValidType = allowedTypes.includes(file.type);
        if (!isValidType) {
          message.error(`You can only upload ${allowedExtensions.join(', ')} files!`);
          return false;
        }
    
        const isLt20M = file.size / 1024 / 1024 <= 20;
        if (!isLt20M) {
          message.error('File must be smaller than 20MB!');
          return false;
        }
    

        return true;
    }; 

    const handleInteraction = async (type:'md_interaction'|'dd_interaction',index=0)=>{
        if(type=='md_interaction'){
            setDrugLoading((prev:any)=>{
                prev[index]=true
                return prev;
            });
        }else{
            setDdLoading(true)
        }
        const medicines = [form.getFieldValue('prescription')?.at(index)?.medication].filter(Boolean);
        const medical_conditions = form.getFieldValue('medicalConditions')?.map((mc:any)=>mc.condition)??[];
        try{
            const res = await drugInteraction({
                medicines,
                medical_conditions,
                type: type,
            }).unwrap()
            if(type=='md_interaction'){
                setMd_InteractionMsg(prev=> [...prev?.filter(p=>p.index!=index)??[], {...res.response,index}])
            }else if(type=='dd_interaction'){
                setDd_InteractionMsg({...res.response})
            }

        }catch(e:any){
            console.log(e)
            message.error('Something went wrong');
        }finally{
            setDrugLoading((prev:any)=>{
                prev[index]= false
                return {...prev};
            });
            setDdLoading(false)
        }
    }

    const formList = [
        //first section
        <>
            <Form.Item
                label = 'Preferred Date'
                name = 'preferredDate'
                rules= {[{required:true,message:'Preferred Date is required'}]}
            >
                <Input readOnly/>
            </Form.Item>

            <Form.Item
                label = 'Start Date'
                name = 'startDate'
                rules= {[{required:true,message:'Start Date is required'}]}
            >
                <DatePicker
                    className="w-full"
                    format='MMMM DD, YYYY hh:mm A'
                    showTime
                />
            </Form.Item>

            <Form.Item
                label = 'End Date'
                name = 'endDate'
                rules= {[{required:true,message:'End Date is required'}]}
            >
                <DatePicker
                    className="w-full"
                    format='MMMM DD, YYYY hh:mm A'
                    showTime
                />
            </Form.Item>

            <Form.Item
                label = 'Symptom'
                name = 'reason'
                rules= {[{required:true,message:'Symptom is required'}]}
            >
                <Input.TextArea rows={2}/>
            </Form.Item>

            <Form.Item
                label = 'Diagnosis'
                name = 'diagnosis'
                rules= {[{required:true,message:'Symptom is required'}]}
            >
                <Input.TextArea rows={2}/>
            </Form.Item>

            <Divider className="!text-gray-400 !font-normal">{`Permanent Medical Conditions (optional)`}</Divider>
            <Form.List name="medicalConditions">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Row key={key} className="flex gap-4 items-center mb-3">
                                <Form.Item
                                    {...restField}
                                    className="flex-1 mb-2"
                                    name={[name, 'condition']}
                                    rules={[{ required: true, message: '' }]}
                                >
                                    <Input placeholder="Condition"/>
                                </Form.Item>                                                              
                                <Row className="justify-end mb-2"><MinusCircleOutlined  onClick={() => remove(name)} /></Row>
                            </Row>
                        ))}
                        <Row justify={'center'}>
                            <Button
                                className="tertiary-button squared-button"
                                icon={<AddOutlinedIcon/>}
                                onClick={()=>add()}
                            >
                                Add
                            </Button>
                        </Row>
                    </>
                )}
            </Form.List>

            <Row justify='center' className="mt-9 gap-4">
                <Button
                    className="primary-button squared-button !px-8 !py-5"
                    onClick={()=>gotoStep(current+1)}
                >
                    Next
                </Button>
            </Row>
        </>,

        //second section
        <>
            <Divider className="!text-gray-400 !font-normal">{`Prescriptions (optional)`}</Divider>
            <Form.List name="prescription">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField },index) => (
                            <Row key={key} className="flex-col" >

                                {/* Action buttons */}
                                <Row className="justify-end mb-2 gap-2">
                                    {
                                        fields.length > 1 && index==0?
                                        ddLoading?<Spin indicator={<LoadingOutlined/>}/>
                                        :<Popover title="Drug To Drug Interaction" trigger="hover">
                                            <ExperimentOutlined className= "text-[17px]" onClick={()=> handleInteraction('dd_interaction',index)} />
                                        </Popover>
                                        :<></>
                                    }
                                    {
                                        drugLoading[index]?<Spin indicator={<LoadingOutlined/>}/>
                                        :<Popover title="Medical Condition To Drug Interaction" trigger="hover">
                                            <MedicineBoxOutlined className= "text-[17px]" onClick={()=> handleInteraction('md_interaction',index)} />
                                        </Popover>
                                    }
                                    <MinusCircleOutlined className= "text-[17px]" onClick={() => remove(name)} />
                                </Row>

                                {/* Interaction message */}
                                {
                                    md_interactionMsg?.find(md=>md.index==index)?
                                    <Box
                                        className={`${md_interactionMsg?.find(md=>md.index==index)?.interaction=='Yes'? 'bg-[#f3d1cd4d] border-2 border-[#fd8274]':'bg-[#dbfaf836] border-2 border-[#2bcfc4]'} my-4 pt-4 pb-2 px-4 rounded-3xl`}
                                    >
                                        <span className="text-gray-700">{md_interactionMsg?.find(md=>md.index==index)?.message}</span>
                                        <Row className="justify-end">
                                            <span 
                                                className="hover:underline cursor-pointer text-secondaryColor"
                                                onClick={()=>{setMd_InteractionMsg(prev=>prev?.filter(p=>p?.index!=index)??[])}}
                                            >
                                                Close
                                            </span>
                                        </Row>
                                    </Box>
                                    :<></>
                                }

                                {/* fields */}
                                <Form.Item
                                    {...restField}
                                    name={[name, 'medication']}
                                    rules={[{ required: true, message: '' }]}
                                >
                                    <Input placeholder="Medication" />
                                </Form.Item>

                                <Row className="!w-full justify-around align-top mb-5 gap-5">
                                    <Form.Item
                                        {...restField}
                                            className="flex-1 mb-0"
                                        name={[name, 'dosage']}
                                        rules={[{ required: true, message: '' }]}
                                    >
                                        <Input placeholder="Dosage"/>
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        className="flex-1 mb-0"
                                        name={[name, 'frequency']}
                                        rules={[{ required: true, message: '' }]}
                                    >
                                        <Input placeholder="Frequency (within 24 hrs)" />
                                    </Form.Item>
                                </Row>

                                <Form.Item
                                    {...restField}
                                    name={[name, 'instructions']}
                                    rules={[{ required: true, message: '' }]}
                                >
                                    <Input.TextArea placeholder="Instructions" rows={2} />
                                </Form.Item>
                                
                            </Row>
                        ))}
                        <Row justify={'center'}>
                            <Button
                                className="tertiary-button squared-button"
                                icon={<AddOutlinedIcon/>}
                                onClick={()=>add()}
                            >
                                Add
                            </Button>
                        </Row>
                    </>
                )}
            </Form.List>

            <Divider className="!text-gray-400 !font-normal">{`Lab Results (optional)`}</Divider>
            <Form.List name="labResults">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField },index) => (
                            <Row key={key} className="flex-col" >
                                <Row className="justify-end mb-2"><MinusCircleOutlined className= "text-[17px]"  onClick={() => {remove(name); setLabResultImgs(prev=>{prev.splice(name, 1);return prev;}) }} /></Row>
                                <Row className={`justify-between align-middle items-center gap-5 flex-wrap mb-3`}>
                                    <Form.Item
                                        {...restField}
                                        className="mb-0 w-full sm:w-[50%]"
                                        name={[name, 'testName']}
                                        rules={[{ required: true, message: '' }]}
                                    >
                                        <Input placeholder="Test Name" />
                                    </Form.Item>
                                    {
                                        form.getFieldValue('labResults')?.at(index)?.result?
                                        <a className="text-blue-600 w-full sm:w-[10%]" href={form.getFieldValue('labResults')?.at(index)?.result??''} target="_blank" rel="noopener noreferrer">
                                            View Result
                                        </a>
                                        :<></>
                                    }
                                    
                                    <Upload 
                                        className=""
                                        beforeUpload={beforeUpload}
                                        multiple={false}
                                        onChange={({file})=>{
                                            if(file.originFileObj){
                                                setLabResultImgs(prev=>{
                                                    if(prev[index]){
                                                        prev[index] = file.originFileObj as File
                                                    }else{
                                                        prev.push(file.originFileObj as File)
                                                    }

                                                    return prev
                                                }) 
                                            }
                                        }}

                                    >
                                        <Button  icon={<UploadOutlined />}>Click to Upload</Button>
                                    </Upload>
                                </Row>                                       
                            </Row>
                        ))}
                        <Row justify={'center'}>
                            <Button
                                className="tertiary-button squared-button mt-3"
                                icon={<AddOutlinedIcon/>}
                                onClick={()=>add()}
                            >
                                Add
                            </Button>
                        </Row>
                    </>
                )}
            </Form.List>

            <Row justify='center' className="mt-9 gap-4">
                <Button
                    className="primary-button squared-button !px-8 !py-5"
                    onClick={()=>gotoStep(current-1)}
                >
                    Back
                </Button>
                <Button
                    className="primary-button squared-button !px-8 !py-5"
                    loading={submitLoading}
                    onClick={onFinish}
                >
                    Submit
                </Button>
            </Row>
        </>
    ]

    useEffect(()=>{
        if(visit && open){
            form.setFieldValue('preferredDate', dayjs(visit.preferredDate).format('MMMM DD, YYYY hh:mm A'))
            form.setFieldValue('startDate', typeof visit.startDate == 'string'? dayjs(visit.startDate):visit.startDate)
            form.setFieldValue('endDate', typeof visit.endDate == 'string'? dayjs(visit.endDate):visit.endDate)
            form.setFieldValue('reason', visit.reason);
            form.setFieldValue('diagnosis', visit.diagnosis);
            form.setFieldValue('prescription', visit.prescription?.map(({_id,...pres}:any)=>pres));
            form.setFieldValue('labResults', visit.labResults?.map(({_id,...res}:any)=>res));
            form.setFieldValue(
                'medicalConditions',
                selectedPatient?.medicalConditions?.map((condition: string) => ({ condition }))
            );

            console.log('selectedPatient###############', selectedPatient?.medicalConditions)
        }
    },[form, visit, open, selectedPatient?.medicalConditions]);

    const matches = useMediaQuery('(min-width:900px)');
    return (
        <CustomModal 
            modalTitle={"Edit Visit"} 
            open={open} 
            setOpen={setOpen}
            width={matches?'50%':'100%'}            
        >
            <Box>
                {
                    dd_interactionMsg?
                    <Box
                        className={`${dd_interactionMsg?.interaction=='Yes'? 'bg-[#f3d1cd4d] border-2 border-[#fd8274]':'bg-[#dbfaf836] border-2 border-[#2bcfc4]'} my-4 pt-4 pb-2 px-4 rounded-3xl`}
                    >
                        <span className="text-gray-700">{dd_interactionMsg?.message}</span>
                        <Row className="justify-end">
                            <span 
                                className="hover:underline cursor-pointer text-secondaryColor"
                                onClick={()=>{setDd_InteractionMsg(null)}}
                            >
                                Close
                            </span>
                        </Row>
                    </Box>
                    :<></>
                }
                <Form
                    form={form} 
                    labelCol={{span:6}}   
                >
                </Form>
                <Steps {...stepsProps}>
                    <Steps.Step title="Personal Information" />
                    <Steps.Step title="Visit Information" />
                </Steps>

                <div style={{ marginTop: 60 }}>
                    <Form
                        {...formProps}
                        labelCol={{ span: 8 }}
                        autoComplete="off"
                        onFinish={onFinish}
                    >
                        {formList[current]}
                    </Form>
                </div>
                
            </Box>
        </CustomModal>
    )
}