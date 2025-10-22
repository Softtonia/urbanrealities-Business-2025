import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function AnalyticsBarChart() {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'Sales',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: '#FB6A18',
                borderColor: '#FB6A18',
                borderWidth: 1,
                barThickness: 12, // Set the bar line width
            }]
        };

        const options = {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };

        const ctx = chartRef.current.getContext('2d');

        if (chartInstance.current !== null) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options,
        });

        return () => {
            if (chartInstance.current !== null) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div className='appointment-dashboard-chart'>
        <p ><strong>Appointment</strong></p>
            <h2 className='total-appointments-heading'>Total Appointments</h2>
            <canvas style={{ maxHeight: '200px' }} ref={chartRef}></canvas>
        </div>
    );
}

export default AnalyticsBarChart;
