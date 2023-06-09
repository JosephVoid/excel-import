import axios from "axios";
import { IData } from "../pages/import_view_page";

/* API ABSRACTIONS */

const AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
})

export const CreateTable = async (body: IData[], name: string) => {
  var result = await AxiosInstance.post('/create-table/'+name, body)
  if (result.status === 200) return true
  else return false
}

export const GetTables = async () => {
  var reponse_array:string[] = [];
  var result = await AxiosInstance.get('/get-tables')
  if (result.status === 200) {
    (result.data).forEach((tb:any) => {
      reponse_array.push(tb.Tables_in_exceldb)
    })
  } 
  return reponse_array
}

export const GetTable = async (id: string) => {
  var result_data:IData[] = []
  var result = await AxiosInstance.get('/get-table/'+id)
  if (result.status === 200) {
    result_data = result.data as IData[]
  }
  return result_data
}

export const DeleteTable = async (name: string) => {
  var result = await AxiosInstance.delete('/delete-table/'+name)
  if (result.status === 200) return true
  else return false
}

export const UpdateTable = async (body: IData[], name: string) => {
  var result = await AxiosInstance.put('/update-table/'+name, body)
  if (result.status === 200) return true
  else return false
}