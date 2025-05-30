import React, { useState } from "react";
import { Button, Divider, Form, Input, message, Row, Select as AntdSelect } from "antd";
import { useRegisterPatientMutation } from "@/redux/api/patientApi";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"; // Import Shadcn select component
import {countries} from "@/data/countries"
import { PatientSignupPayload } from "@/types/patient";
import {allergyOptions} from '@/data/PatientData'
import {conditionOptions} from '@/data/PatientData'
import {pastTreatmentOptions} from '@/data/PatientData'
import {majorAccidentOptions} from '@/data/PatientData'
import { X } from "lucide-react"; 


const generateOptions = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => ({
    label: `${start + i}`,
    value: start + i,
  }));
};

const PatientSignupForm = ({ setParentTab, onSignupSuccess }: { setParentTab: any; onSignupSuccess: (email: string, role: "patient") => void }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0); 
  const [formValues, setFormValues] = useState<PatientSignupPayload>({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    gender: "male",
    age: 0,
    nationality: "",
    password: "",
    height: 0,
    weight: 0,
    blood: "A+",
    allergies: [],
    medicalConditions: [],
    pastTreatments: [],
    majorAccidents: [],
  });

  const [registerPatient, {isLoading, isError, error}] = useRegisterPatientMutation();

  const onFinish = async (value: PatientSignupPayload) => {
    try {
      await registerPatient(formValues).unwrap();
      message.success("Registration successful!");
      onSignupSuccess(formValues.email, "patient"); 
    } catch (error: any) {
      message.error(error?.data?.error || "Registration failed, please try again");
    }
  };

  const goToStep = (step: number) => setCurrentStep(step); 

  const handleStepChange = (changedValues: any) => {
    setFormValues((prevValues) => ({ ...prevValues, ...changedValues }));
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      onFinishFailed={() => {
        message.error("Please submit the form correctly");
      }}
      onValuesChange={handleStepChange} 
      className="w-[100%] flex flex-col gap-4 mt-20"
    >
      {currentStep === 0 && ( 
        <>
          <Divider orientation="left">Personal Details</Divider>

          <Form.Item
            layout="vertical"
            label="First Name"
            name="firstname"
            rules={[{ required: true, message: "First name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            layout="vertical"
            label="Last Name"
            name="lastname"
            rules={[{ required: true, message: "Last name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            layout="vertical"
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Valid email is required",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            layout="vertical"
            label="Phone"
            name="phoneNumber"
            rules={[
              { required: true, message: "Phone number is required" },
              {
                message: "Invalid phone number",
                validator: (_, value) => {
                  if (/^\+?[1-9][0-9]{0,14}$/.test(value)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("Invalid phone number");
                  }
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Row className="w-[100%] justify-between items-center gap-7">
            <Form.Item
              layout="vertical"
              label="Gender"
              name="gender"
              className="w-[45%]"
              rules={[{ required: true, message: "Gender is required" }]}
            >
              <AntdSelect
                options={["male", "female"].map((value) => ({
                  label: value[0].toUpperCase() + value.slice(1),
                  value,
                }))}
              />
            </Form.Item>

            <Form.Item
              layout="vertical"
              label="Age"
              name="age"
              className="w-[40%]"
              rules={[{ required: true, message: "Age is required" }]}
            >
              <AntdSelect className="w-[100%]" options={generateOptions(0, 120)} />
            </Form.Item>
          </Row>

          <Form.Item
            layout="vertical"
            label="Nationality"
            name="nationality"
            rules={[{ required: true, message: "Nationality is required" }]}
          >
            <Select
              onValueChange={(value) => handleStepChange({ nationality: value })}
              value={formValues.nationality}
            >
              <SelectTrigger className="border-gray-300 bg-gray-100 focus:border-gray-400 p-5">
                <SelectValue placeholder="Select your nationality" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Form.Item>

          <Row className="w-[100%] mt-2">
            <Button
              className="primary-button primary-button-white-text"
              onClick={() => goToStep(1)} 
            >
              Continue
            </Button>
          </Row>
        </>
      )}

      {currentStep === 1 && ( 
        <>
          <Divider orientation="left">Health Details</Divider>

          <Form.Item
            layout="vertical"
            label="Height (cm)"
            name="height"
            rules={[{ required: true, message: "Height is required" }]}
          >
            <AntdSelect className="w-[100%]" options={generateOptions(100, 300)} />
          </Form.Item>

          <Form.Item
            layout="vertical"
            label="Weight (kg)"
            name="weight"
            rules={[{ required: true, message: "Weight is required" }]}
          >
            <AntdSelect className="w-[100%]" options={generateOptions(1, 300)} />
          </Form.Item>

          <Form.Item
            layout="vertical"
            label="Blood Type"
            name="blood"
            rules={[{ required: true, message: "Blood type is required" }]}
          >
            <AntdSelect
              options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (value) => ({ label: value, value })
              )}
            />
          </Form.Item>

          <Row className="w-[100%] mt-2">
            <Button
              className="primary-button primary-button-white-text"
              onClick={() => goToStep(0)} 
            >
              Back
            </Button>
            <Button
              className="primary-button primary-button-white-text ml-2"
              onClick={() => goToStep(2)} 
            >
              Continue
            </Button>
          </Row>
        </>
      )}

      {currentStep === 2 && (
        <>
          <Divider orientation="left">
            Additional Medical Information (Optional)
          </Divider>

          {/* Allergies */}
          <div className="flex flex-col gap-3">
            <Form.Item layout="vertical" label="Allergies">
              <Select
                onValueChange={(val) => {
                  if (!formValues.allergies?.includes(val)) {
                    handleStepChange({ allergies: [...(formValues.allergies || []), val] });
                  }
                }}
                value=""
              >
                <SelectTrigger className="border-gray-300 bg-gray-100 focus:border-gray-400 p-5">
                  <SelectValue placeholder="Select an Allergy" />
                </SelectTrigger>
                <SelectContent>
                  {allergyOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Form.Item>
            <div className="">
              {formValues.allergies && formValues.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formValues.allergies?.map((item, idx) => (
                    <div key={idx} className="flex items-center bg-gray-500 text-white px-2 py-1 rounded">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleStepChange({ allergies: formValues.allergies?.filter((a) => a !== item) })
                        }
                        className="ml-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="flex flex-col gap-3">
            <Form.Item layout="vertical" label="Medical Conditions">
              <Select
                onValueChange={(val) => {
                  if (!formValues.medicalConditions?.includes(val)) {
                    handleStepChange({ medicalConditions: [...(formValues.medicalConditions || []), val] });
                  }
                }}
                value=""
              >
                <SelectTrigger className="border-gray-300 bg-gray-100 focus:border-gray-400 p-5">
                  <SelectValue placeholder="Select a Condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditionOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Form.Item>
            <div className="">
              {formValues.medicalConditions && formValues.medicalConditions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formValues.medicalConditions.map((item, idx) => (
                    <div key={idx} className="flex items-center bg-gray-500 text-white px-2 py-1 rounded">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleStepChange({ medicalConditions: formValues.medicalConditions?.filter((m) => m !== item) })
                        }
                        className="ml-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Past Treatments */}
          <div className="flex flex-col gap-3">
            <Form.Item layout="vertical" label="Past Treatments">
              <Select
                onValueChange={(val) => {
                  if (!formValues.pastTreatments?.includes(val)) {
                    handleStepChange({ pastTreatments: [...(formValues.pastTreatments || []), val] });
                  }
                }}
                value=""
              >
                <SelectTrigger className="border-gray-300 bg-gray-100 focus:border-gray-400 p-5">
                  <SelectValue placeholder="Select a Past Treatment" />
                </SelectTrigger>
                <SelectContent>
                  {pastTreatmentOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Form.Item>
            <div className="">
              {formValues.pastTreatments && formValues.pastTreatments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formValues.pastTreatments.map((item, idx) => (
                    <div key={idx} className="flex items-center bg-gray-500 text-white px-2 py-1 rounded">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleStepChange({ pastTreatments: formValues.pastTreatments?.filter((t) => t !== item) })
                        }
                        className="ml-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Major Accidents */}
          <div className="flex flex-col gap-3">
            <Form.Item layout="vertical" label="Major Accidents">
              <Select
                onValueChange={(val) => {
                  if (!formValues.majorAccidents?.includes(val)) {
                    handleStepChange({ majorAccidents: [...(formValues.majorAccidents || []), val] });
                  }
                }}
                value=""
              >
                <SelectTrigger className="border-gray-300 bg-gray-100 focus:border-gray-400 p-5">
                  <SelectValue placeholder="Select a Major Accident" />
                </SelectTrigger>
                <SelectContent>
                  {majorAccidentOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Form.Item>
            <div className="">
              {formValues.majorAccidents && formValues.majorAccidents.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formValues.majorAccidents?.map((item, idx) => (
                    <div key={idx} className="flex items-center bg-gray-500 text-white px-2 py-1 rounded">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleStepChange({ majorAccidents: formValues.majorAccidents?.filter((m) => m !== item) })
                        }
                        className="ml-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* --- End Additional Medical Information --- */}

          <Row className="w-[100%] mt-2">
            <Button
              className="primary-button primary-button-white-text"
              onClick={() => goToStep(1)} 
            >
              Back
            </Button>
            <Button
              className="primary-button primary-button-white-text ml-2"
              onClick={() => goToStep(3)} 
            >
              Continue
            </Button>
          </Row>
        </>
      )}

      {currentStep === 3 && ( 
        <>
          <Divider orientation="left">Set Password</Divider>

          <Form.Item
            layout="vertical"
            label="Password"
            name="password"
            className="w-[100%]"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Row className="w-[100%] mt-8">
            <Button
              className="primary-button primary-button-white-text"
              onClick={() => goToStep(2)} 
            >
              Back
            </Button>
            <Button
              className="primary-button primary-button-white-text ml-2"
              htmlType="submit"
              loading={isLoading}
            >
              Register
            </Button>
          </Row>
        </>
      )}
    </Form>
  );
};

export default PatientSignupForm;
