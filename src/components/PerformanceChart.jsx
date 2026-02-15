import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const PerformanceChart = ({ history }) => {
    const data = {
        labels: history.map((_, i) => `Session ${i + 1}`),
        datasets: [
            {
                label: 'Avg Reaction (ms)',
                data: history.map(h => h.avgReaction),
                borderColor: '#00f2ff',
                backgroundColor: 'rgba(0, 242, 255, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#00f2ff',
            },
            {
                label: 'Accuracy (%)',
                data: history.map(h => h.accuracy),
                borderColor: '#39ff14',
                backgroundColor: 'rgba(57, 255, 20, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#39ff14',
                yAxisID: 'accuracy',
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#8b949e', font: { family: 'Inter', size: 10 } }
            },
            tooltip: {
                backgroundColor: '#161b22',
                titleColor: '#e6edf3',
                bodyColor: '#e6edf3',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#8b949e' }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#8b949e' },
                title: { display: true, text: 'Reaction Time (ms)', color: '#8b949e' }
            },
            accuracy: {
                position: 'right',
                min: 0,
                max: 100,
                grid: { display: false },
                ticks: { color: '#8b949e' },
                title: { display: true, text: 'Accuracy (%)', color: '#8b949e' }
            }
        }
    };

    return (
        <div style={{ height: '200px', width: '100%', marginTop: '1rem' }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default PerformanceChart;
