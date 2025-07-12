import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Button, Divider, Form, Input, message, Row } from "antd";
import { GoogleCircleFilled } from "@ant-design/icons";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import { useRouter } from "next/navigation";
import { loginDoctor } from "@/redux/api/doctorApi";
import { loginPatient } from "@/redux/api/patientApi";
import { loginAdmin } from "@/redux/api/adminApi";
import { useSessionUser } from "../context/Session";
import { fetchMe } from "@/redux/api/commonApi";
                                    
type LoginProb = {
  setTab: any;
};

interface FormValues {
  password: string;
  phone: string;
  role: string;
}

export async function authenticateUser( password: string,role:'admin'|'patient'|'doctor',phone?: string,email?:string) {

    let result:any = null;

    switch(role){
        case 'patient':
            result = await loginPatient(password,phone,email)
            break
        case 'doctor':
            result = await loginDoctor(password,phone,email)
            break
        case 'admin':
            result = await loginAdmin(password,phone,email)
            break
    }

    if (result) {
        return {
            id: result?.data?._id || "",
            role,
            user:result?.data
        };
    }

    return null;
}

const Login = ({ setTab }: LoginProb) => {
  const {setUser} = useSessionUser();
  const [form] = Form.useForm();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const [role, setRole] = useState<'patient'|'doctor'|'admin'>('admin');

  const onFinish = async (values: FormValues) => {
    const { phone, password } = values;
    let credential:any={};
    const isEmail = phone? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(phone):true;
    const isPhone = phone? /^\+?[1-9]\d{1,14}$/.test(phone):true;
    
    if (!isEmail && !isPhone) {
      message.error("Please enter a valid credential");
      return;
    }

    if(isEmail) credential = {email:values.phone}
    else if(isPhone) credential = {phone:values.phone}

    try {
      setIsLoggingIn(true);

      const result = await authenticateUser(password,role,credential.phone,credential.email)

      if (!result) {
          message.error("Incorrect credential")
          setIsLoggingIn(false);
      } else {
          message.success("Login successful.")

          localStorage.setItem('role',role=='admin'?role:role+'s')
          const res = await fetchMe(role=='admin'?role:role+'s' as any)
          if(res?.data){
            setUser(res.data);
            // Push to dashboard route
            router.push(
              role=='doctor'?
              "/doctor/dashboard"
              :role=='patient'?
              "/patient/dashboard"
              :"/admin/dashboard"
            );
          }else{
            message.error('Something went wrong, please try again')
            setIsLoggingIn(false);
          }
      }

    } catch (error: any) {
      message.error(error?.data?.error || "An error occurred.");
      setIsLoggingIn(false);
    }
  };

  const options:('patient'|'doctor')[]  = ["patient", "doctor"];

  const handleSelect = (value:'patient'|'admin'|'doctor') => {
    setRole(prev => (prev === value ? 'admin' : value)); // Toggle selection
  };
  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={() => {
          message.error("Please submit the form correctly");
        }}
        className="w-[100%] flex flex-col gap-7 mt-20 p-4 md:p-0"
      >
        <Row justify='center'>

          <div className="flex gap-4">
            {options.map(option => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className={`px-6 py-1 rounded-3xl border transition-all select-none cursor-pointer 
                  ${role === option ? "bg-[#FFA07A] text-white" : "bg-white border-gray-400 text-gray-700"}`}
              >
                I&apos;m {option}
              </div>
            ))}
          </div>
        </Row>
        <Form.Item
          layout="vertical"
          label="Phone or Email"
          name="phone"
          rules={[
            { required: true, message: "Phone number or Email is required" },
          ]}
        >
          <Input />
        </Form.Item>
        <Row className="flex flex-col w-[100%] gap-4 items-end">
          <Form.Item
            layout="vertical"
            label="Password"
            name="password"
            className="w-[100%]"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password />
          </Form.Item>
          <Typography className="text-primary-foreground text-xs cursor-pointer">
            Forgot password?
          </Typography>
        </Row>
        <Row className="flex-col items-center gap-3 w-[100%]">
          <Button
            htmlType="submit"
            loading={isLoggingIn}
            className="primary-button primary-button-white-text"
          >
            Login
          </Button>
          <Typography className="text-primary-foreground text-sm">{`Don't have an account?`}</Typography>
          <Typography
            className="text-primary font-semibold cursor-pointer"
            onClick={() => setTab(1)}
          >
            SIGN UP
          </Typography>
        </Row>
        <Box className="w-[100%]">
          <Divider className="!mb-2">
            <span className="text-[#afafaf]">Continue with</span>
          </Divider>
          <Row className="w-[100%] justify-center items-center gap-2">
            <GoogleCircleFilled className="text-3xl text-[#cccccc] cursor-pointer" />
            <FacebookRoundedIcon className="text-[35px] text-[#cccccc] cursor-pointer" />
          </Row>
        </Box>
      </Form>
    </>
  );
};

export default Login;
