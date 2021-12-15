import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import dashBoardApi from 'api/dashBoardApi';
import { numberWithCommas } from 'utils';


export interface TopPriceOrders {
  orderType: number;
  amount: number;
}

const month = new Date().getMonth() + 1;
export default function TopPriceOrder() {

  const [dataTop, setDataTop] = useState<TopPriceOrders[]>();

  useEffect(() => {
    const getAll = async () => {
      const data = await dashBoardApi.getAmountOrder();
      setDataTop(data);
    };
    getAll();
  }, []);
  ChartJS.register(ArcElement, Tooltip, Legend);

  const total = dataTop?.reduce((sum, data) => sum + Number(data.amount), 0);
   const options = {
     responsive: true,
     plugins: {
       legend: {
         position: 'top' as const,
       },
       title: {
         display: true,
         text: `BIỂU ĐỒ THỐNG KÊ DOANH THU THÁNG ${month} Tổng : ${numberWithCommas(total)}`,
       },
     },
   };
  const data = {
    labels: dataTop?.map((item) => item.orderType),
    datasets: [
      {
        data: dataTop?.map((item) => item.amount),
        backgroundColor: [
          'rgba(186, 21, 115, 0.8)',
          'rgba(0, 0, 0, 0.5)',
          'rgba(27, 45, 217, 0.8)',
        ],
        borderColor: ['rgba(186, 21, 115, 0.8)', 'rgba(0, 0, 0, 0.5)', 'rgba(27, 45, 217, 0.8)'],
        borderWidth: 1,
      },
    ],
  };
  return <Pie options={options} data={data} />;
}
