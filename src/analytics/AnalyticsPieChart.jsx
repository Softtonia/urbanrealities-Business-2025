import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Container } from '@mui/material';

const AnalyticsPieChart = () => {
  const data = [
    { id: 0, value: 10, label: 'Resedential' },
    { id: 1, value: 15, label: 'Commercial' },
    { id: 3, value: 20, label: 'Industrial' },
    { id: 4, value: 25, label: 'PG' },
  ];

  return (
    <Container>
      <PieChart
        series={[
          {
            data,
          },
        ]}
        width={400}
        height={200}
      />
    </Container>
  );
};

export default AnalyticsPieChart;
