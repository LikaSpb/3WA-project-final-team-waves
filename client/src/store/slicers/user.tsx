import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IUserData {
  _id: string;
  firstname: string;
  lastname: string;
  dateOfBirth: string;
  email: string;
  jobTitle?: string;
  company?: string;
  password: string;
  profilePicture: string;
  role: number;
  initSocketConnector: string;
}

const initialState = {
  userId: "",
  firstname: "",
  lastname: "",
  dateOfBirth: "",
  email: "",
  jobTitle: "",
  company: "",
  password: "",
  profilePicture: "",
  role: 0,
  initSocketConnector: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload || "";
    },
    setInitConnector: (state) => {
      state.initSocketConnector = true
    },
    setUserData: (state, action: PayloadAction<IUserData>) => {
      const {
        _id,
        firstname,
        lastname,
        dateOfBirth,
        email,
        jobTitle,
        company,
        password,
        profilePicture,
        role,
      } = action.payload;
      state.userId = _id;
      state.firstname = firstname;
      state.lastname = lastname;
      state.dateOfBirth = dateOfBirth;
      state.email = email;
      state.jobTitle = jobTitle || "";
      state.company = company || "";
      state.password = password;
      state.profilePicture = profilePicture;
      state.role = role;
    },
  },
});

export const { setUserData, setInitConnector } = userSlice.actions;
export default userSlice.reducer;
