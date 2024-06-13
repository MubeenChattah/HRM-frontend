import * as Yup from "yup";

export const SignUpSchema = Yup.object({
  name: Yup.string().min(2).max(25).required("Enter Your Name"),
  username: Yup.string().min(6).max(25).required("Enter Your username"),
  email_mobile: Yup.string().email().required("Enter Your Email"),
  password: Yup.string().min(6).required("Set Your Password"),
});

export const LogInSchema = Yup.object({
  email_mobile: Yup.string().email().required("Enter Your Email"),
  password: Yup.string().min(6).required("Enter Your Password"),
});
