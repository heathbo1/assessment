import { TableBody } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import './App.css';
import fakeData from './Data/FakeData.json';

interface IdateData {
  "month": string,
  "value": number
}

interface IData {
  data: IdateData[],
  name: string,
  total: number
}

interface ICustomers {
  customers: IData[]
}

function App() {
  const [cdata, setCdata] = useState<ICustomers | null>(null)

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    // Rest call
    // const response = await fetch('http://dataUrl.com/data.json')
    // const customerData = await response.json()
    // processData(customerData)
    processData(fakeData)
}
  
  const processData = (data: any) => {

    const calculatePoints = (value: number) => {
      const over100 = Math.sign(value - 100) >= 1 ? 2 * (value - 100) : 0
      
      const fiftyPoint = value > 50 ? 1 : 0
      
      return over100 + fiftyPoint
    }
    
    const customers_Data: ICustomers = {
      customers: []
    }

    data.customers.forEach((customer: IData) => {
      const customerData: IData = {
        "data": [], // object month and points
        "name": customer.name,
        "total": 0
      }

      customer.data.forEach((month: IdateData) => {
        const points = calculatePoints(month.value)
        
        if (customerData.data.find(m => m.month === month.month)) {
          const index = customerData.data.findIndex(m => m.month === month.month)
          customerData.data[index].value = customerData.data[index].value + points

        } else {
          customerData.data.push({"month": month.month, "value": points})
        }
        customerData.total = customerData.total + points
      })
      customers_Data.customers.push(customerData)
    })
    setCdata(customers_Data)
  }

  const displayData = ():any => {
    return cdata?.customers.map((c) => {
      return c.data.map((month: IdateData, index) => {
        if (index === c.data.length - 1) {
          return (
          <>
            <TableRow key={index}><TableCell></TableCell><TableCell>{month.month}</TableCell><TableCell>{month.value}</TableCell></TableRow>
            <TableRow key={`${index}2`}><TableCell></TableCell><TableCell></TableCell><TableCell>{`Total: ${c.total}`}</TableCell></TableRow>
          </>
        )
        } else if(index === 0) {
          return <>
            <TableRow key={index}><TableCell>{c.name}</TableCell><TableCell></TableCell><TableCell></TableCell></TableRow>
            <TableRow key={`${index}2`}><TableCell></TableCell><TableCell>{month.month}</TableCell><TableCell>{month.value}</TableCell></TableRow>
          </>
          
        }else {
          return <TableRow key={index}><TableCell></TableCell><TableCell>{month.month}</TableCell><TableCell>{month.value}</TableCell></TableRow>
        }
      })
      })
  }

  return (
    <div className="App">

        <TableContainer component={Paper} className="table">
          <Table >
            <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Points</TableCell>
              </TableRow>
          </TableHead>
          <TableBody>
            { displayData() }
          </TableBody>
          </Table>
        </TableContainer>

    </div>
  );
}

export default App;
