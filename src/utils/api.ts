import axios from "axios";
import { IData } from "../pages/import_view_page";

const AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
})

export const ReqCreateTable = (body: IData[]) => {

}

export const ReqGetTables = () => {
  
}

export const ReqGetTable = (id: string) => {
  
}

export const ReqDelTable = (id: string) => {
  
}

export const ReqUpdateTable = (body: IData[]) => {

}