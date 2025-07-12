"use client"

import { useState, useEffect } from "react"
import { Form, Input, Select, Row, Button, message, InputNumber, Col, Divider, Modal, Tag, DatePicker } from "antd"
import { qualifications, specializations } from "@/data/DoctorData"
import type { DoctorSignupPayload } from "@/types/doctor"
import { useRegisterDoctorMutation } from "@/redux/api/doctorApi"
import { useGetAllHospitalsSearchQuery, usePostHospitalMutation } from "@/redux/api/hospitalApi"
import CloudinaryUploader from "./CloudinaryUploader"

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const DoctorSignupForm = ({ setParentTab, onSignupSuccess }: { setParentTab: any; onSignupSuccess: (email: string, role: "doctor") => void }) => {
  const [form] = Form.useForm()
  const [current, setCurrent] = useState(0)
  const [formValues, setFormValues] = useState<DoctorSignupPayload>({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    gender: "male",
    birthDate: null,
    age: 0,
    password: "",
    role: "doctor",
    specializations: [],
    qualifications: [],
    licenses: [],
    hospital: undefined,
  })

  const [isHospitalModalVisible, setIsHospitalModalVisible] = useState(false)
  const [hospitalForm] = Form.useForm()
  const [selectedHospitalName, setSelectedHospitalName] = useState<string | null>(null)
  const [uploadedLicenses, setUploadedLicenses] = useState<Array<{ url: string; type: string; isVerified: boolean }>>(
    [],
  )

  const { data: hospitals, isLoading: isLoadingHospitals } = useGetAllHospitalsSearchQuery()
  const [postHospital, { isLoading: isAddingHospital }] = usePostHospitalMutation()

  const [registerDoctor, { isLoading }] = useRegisterDoctorMutation()

  useEffect(() => {
    form.setFieldsValue(formValues)
  }, [current, form, formValues])

  useEffect(() => {
    if (formValues.hospital && hospitals?.data?.hospitals) {
      const hospital = hospitals.data.hospitals.find((h: any) => h._id === formValues.hospital)
      if (hospital) {
        setSelectedHospitalName(hospital.name)
      }
    }
  }, [formValues.hospital, hospitals])

  const goToStep = (step: number) => setCurrent(step)

  const onFinish = async (values: DoctorSignupPayload) => {
    const finalValues = {
      ...formValues,
      ...values,
      licenses: uploadedLicenses, 
    }
    // filter out birthDate from the final values
    const { birthDate, ...restFinalValues } = finalValues;
    console.log("Form form values", restFinalValues)

    try {
      await registerDoctor(restFinalValues).unwrap()
      message.success("Registration successful!")
      onSignupSuccess(restFinalValues.email, "doctor"); 
    } catch (error: any) {
      message.error(error?.data?.error || "Registration failed, please try again")
    }
  }

  const handleStepChange = (changedValues: any) => {
    setFormValues((prevValues) => ({ ...prevValues, ...changedValues }))
  }

  const handleLicenseUpload = (url: string) => {
    const newLicense = { url, type: "pdf", isVerified: false }
    setUploadedLicenses((prev) => [...prev, newLicense])

    setFormValues((prev) => ({
      ...prev,
      licenses: [...uploadedLicenses, newLicense],
    }))
  }

  const handleAddHospital = async (values: any) => {
    try {
      const result = await postHospital(values).unwrap()
      message.success("Hospital added successfully!")
      setFormValues((prev) => ({
        ...prev,
        hospital: result._id, 
      }))
      setSelectedHospitalName(values.name)
      setIsHospitalModalVisible(false)
      hospitalForm.resetFields()
    } catch (error: any) {
      message.error(error?.data?.error || "Failed to add hospital")
    }
  }

  const calculateAgeFromBirthDate = (date:Date) => {
     const today = new Date()
    const birthDate = new Date(date.toISOString())
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age;
  }

  const formList = [
    // Step 1: Personal Details
    <Row key="step-1" justify="center">
      <Col span={24}>
        <Divider orientation="left">Personal Details</Divider>
      </Col>
      {["First Name", "Last Name", "Email", "Gender", "Birth Date"].map((label) => (
        <Col span={24} key={label}>
          <Form.Item
            {...formItemLayout}
            label={label}
            name={label.replace(/\s+/g, "").toLowerCase()}
            rules={[{ required: true, message: `${label} is required` }]}
          >
            {label === "Gender" ? (
              <Select
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
              />
            ) : label === "Birth Date" ? (
                <>
                  <DatePicker
                    value={formValues.birthDate}
                    className="w-full"
                    onChange={(date) => {
                      if (date) {
                        const age = calculateAgeFromBirthDate(date)
                        console.log("Calculated age:", age);
                        form.setFieldsValue({ age })
                        setFormValues((prev) => ({ ...prev, age, birthDate: date }))
                      } else {
                        setFormValues((prev) => ({ ...prev, age: 0, birthDate: null }))
                        }
                      }}

                  />
                  <Form.Item name="age" hidden>
                    <InputNumber />
                  </Form.Item>
                </>
                
              ) : (

              <Input />
            )}
          </Form.Item>
        </Col>
      ))}
      <Col span={24}>
        <Form.Item
          {...formItemLayout}
          label="Phone Number"
          name="phoneNumber"
          rules={[{ required: true, message: "Phone Number is required" }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={() => goToStep(current + 1)}
          className="primary-button primary-button-white-text"
        >
          Continue
        </Button>
      </Col>
    </Row>,

    // Step 2: Professional Details
    <Row key="step-2" gutter={[16, 8]} justify="center">
      <Col span={24}>
        <Divider orientation="left">Professional Details</Divider>
      </Col>
      <Col span={24}>
        <Form.Item
          {...formItemLayout}
          label="Hospital"
          name="hospital"
          rules={[{ required: false, message: "Hospital is required" }]}
        >
          <div className="space-y-2">
            <div className="flex flex-row gap-2">
              <Select
                showSearch
                placeholder="Select a hospital"
                loading={isLoadingHospitals}
                className="w-full"
                optionFilterProp="children"
                value={formValues.hospital}
                onChange={(value, option: any) => {
                  setFormValues((prev) => ({
                    ...prev,
                    hospital: value,
                  }))
                  setSelectedHospitalName(option?.label || null)
                }}
                filterOption={(input, option) =>
                  (option?.label?.toString().toLowerCase() ?? "").includes(input.toLowerCase())
                }
                options={
                  hospitals?.data?.hospitals?.map((hospital: any) => ({
                    label: hospital.name,
                    value: hospital._id,
                  })) || []
                }
              />
              <Button onClick={() => setIsHospitalModalVisible(true)} className="bg-secondaryColor">
                Add New
              </Button>
            </div>
            {selectedHospitalName && (
              <div className="mt-2">
                <Tag color="blue">Selected: {selectedHospitalName}</Tag>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Please make sure your hospital is not already in the list before adding a new one.
            </p>
          </div>
        </Form.Item>
      </Col>
      {["Specializations", "Qualifications"].map((label) => (
        <Col span={24} key={label}>
          <Form.Item
            {...formItemLayout}
            label={label}
            name={label.toLowerCase()}
            rules={[{ required: true, message: `${label} is required` }]}
          >
            <Select
              mode="multiple"
              showSearch
              options={(label === "Specializations" ? specializations : qualifications).map((value) => ({
                label: value,
                value,
              }))}
            />
          </Form.Item>
        </Col>
      ))}
      <Col span={24}>
        <Form.Item
          {...formItemLayout}
          label="Licenses"
          name="licenses"
          rules={[{ required: true, message: "Please upload your licenses" }]}
        >
          <div>
            <CloudinaryUploader onUploadSuccess={handleLicenseUpload} />
            {uploadedLicenses.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-1">Uploaded Licenses:</p>
                <div className="flex flex-wrap gap-2">
                  {uploadedLicenses.map((license, index) => (
                    <Tag key={index} color="green">
                      License {index + 1}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Form.Item>
      </Col>
      <Col span={24}>
        <Button onClick={() => goToStep(current - 1)} className="primary-button primary-button-white-text">
          Back
        </Button>
        <Button
          type="primary"
          onClick={() => goToStep(current + 1)}
          className="primary-button primary-button-white-text"
          style={{ marginLeft: 8 }}
        >
          Continue
        </Button>
      </Col>
    </Row>,

    // Step 3: Password
    <Row key="step-3" gutter={[16, 8]} justify="center">
      <Col span={24}>
        <Divider orientation="left">Password</Divider>
      </Col>
      <Col span={24}>
        <Form.Item
          {...formItemLayout}
          label="Password"
          name="password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Button onClick={() => goToStep(current - 1)} className="primary-button primary-button-white-text">
          Back
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          className="primary-button primary-button-white-text"
          style={{ marginLeft: 8 }}
        >
          Register
        </Button>
      </Col>
    </Row>,
  ]

  const hospitalModal = (
    <Modal
      title="Add New Hospital"
      open={isHospitalModalVisible}
      onCancel={() => setIsHospitalModalVisible(false)}
      footer={null}
      centered
      style={{ top: 0 }}
    >
      <div className="mb-4">
        <p className="text-red-500 font-medium">
          Please ensure your hospital is not already in the dropdown list before adding a new one.
        </p>
      </div>
      <Form form={hospitalForm} layout="vertical" onFinish={handleAddHospital}>
        <Form.Item label="Hospital Name" name="name" rules={[{ required: true, message: "Hospital name is required" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Branch Number"
          name="branch"
          rules={[{ required: true, message: "Branch number is required" }]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>
        <Form.Item label="Address">
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item
                name={["address", "street"]}
                label="Street"
                rules={[{ required: true, message: "Street is required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["address", "city"]}
                label="City"
                rules={[{ required: true, message: "City is required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["address", "region"]}
                label="Region"
                rules={[{ required: true, message: "Region is required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["address", "country"]}
                label="Country"
                rules={[{ required: true, message: "Country is required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["address", "postalCode"]}
                label="Postal Code"
                rules={[{ required: true, message: "Postal code is required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" loading={isAddingHospital} className="w-full bg-secondaryColor">
            Add Hospital
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )

  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        onValuesChange={handleStepChange}
        onFinishFailed={() => message.error("Please fill all required fields")}
        layout="vertical"
        initialValues={formValues}
      >
        {formList[current]}
      </Form>
      {hospitalModal}
    </>
  )
}

export default DoctorSignupForm

