import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ['IDO/Public sale', 'Development', 'Marketing', 'Liquidity', 'Team', 'Staking', 'Advisers', 'Ecosystem', 'Airdrop'],
  datasets: [
    {
      label: '# of Votes',
      data: [15, 20, 17, 9, 7, 10, 5, 14, 3],
      backgroundColor: [
        '#5aaefe',
        '#2381d9',
        '#0363bd',
        '#9e4043',
        '#ff6267',
        '#ff8e92',
        '#98caf9',
        '#ff676c',
        '#adbddd',
        
      ],
      borderColor: [
        '#5aaefe',
        '#2381d9',
        '#0363bd',
        '#9e4043',
        '#ff6267',
        '#ff8e92',
        '#98caf9',
        '#ff676c',
        '#adbddd',
       
      ],
      borderWidth: 1,
    },
  ],
};

function Chart() {
  return <div className='chart_widyth'> <Doughnut data={data} /></div>;
}

export default Chart;
