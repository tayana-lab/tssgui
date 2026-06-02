import React, { useState, useEffect } from 'react';
import TssConf from '@app/modules/conf/TssGui.json';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [productDetails, setProductDetails] = useState([]);
  const username = localStorage.getItem('username');
  const acctId   = localStorage.getItem('acctID');

  useEffect(() => {
    localStorage.setItem('modulePath',        '');
    localStorage.setItem('moduleVersionType', '0');
    localStorage.setItem('moduleHeading',     'Dashboard');

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `${TssConf.SERVER_JS_API_URI}/productDetails?acctId=${acctId}&tenantCode=${localStorage.getItem('tenantCode')}`
        );
        if (!response.ok) throw new Error('Failed to fetch product details');
        const data = await response.json();
        setProductDetails(data);
      } catch {
        // non-critical
      }
    };

    fetchProductDetails();
  }, []);

  const doughnutData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [{
      label: 'Distribution',
      data: [200, 150, 100],
      backgroundColor: ['rgb(255,99,132)', 'rgb(54,162,235)', 'rgb(255,205,86)'],
      hoverOffset: 4,
    }],
  };

  return (
    <div className="tss-content-body">
      {TssConf.PRODUCT_ID !== '0' && TssConf.PRODUCT_ID !== 0 ? (
        /* ---- Product-specific dashboard ---- */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="tss-card">
            <div className="tss-card-header no-collapse">
              <i className="fas fa-chart-pie mr-2" style={{ color: 'var(--color-primary)' }} />
              MDA License Graph
            </div>
            <div className="tss-card-body">
              {/* <LastOneMinuteLicense nodeNos={nodeNos} /> */}
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Chart data will appear here</p>
            </div>
          </div>
        </div>
      ) : (
        /* ---- Demo / placeholder dashboard ---- */
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary-light)' }}
          >
            <i className="fas fa-tachometer-alt text-2xl" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3
            className="text-base font-semibold"
            style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}
          >
            Dashboard is in Progress...
          </h3>
          <p className="text-sm text-center max-w-sm" style={{ color: 'var(--color-text-muted)' }}>
            Your dashboard widgets will appear here once configured.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
