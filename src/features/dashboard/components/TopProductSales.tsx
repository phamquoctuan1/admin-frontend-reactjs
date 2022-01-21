import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import dashBoardApi from 'api/dashBoardApi';


export interface TopProductSale {
  productId: number;
  productName: string;
  qty: number;
}
const month = new Date().getMonth()+1;

export default function TopProductSales() {

  const [dataTop, setDataTop] = useState<TopProductSale[]>();

  useEffect(() => {
    const getAll = async () => {
      const data = await dashBoardApi.getTopProduct();
      setDataTop(data);
    };
    getAll();
  }, []);
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
 
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `DANH SÁCH SẢN PHẨM BÁN CHẠY TRONG THÁNG  ${month}`,
      },
    },
  };
  
  const labels = dataTop?.map((item)=> item.productName);
  const data = {
    labels,
    datasets: [
      {
        label: 'Tên sản phẩm',
        data: dataTop?.map((item) => item.qty),
      backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ],
      },
    ],
  };
  return <Bar options={options} data={data} />
}
