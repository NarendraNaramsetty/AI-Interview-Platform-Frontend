import React, { useState, useEffect } from 'react';
import styles from './SummaryReport.module.css';
import ApiService from '../../service/Apiservice';
import { toast, ToastContainer } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const SummaryReport = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total_revenue: 0,
    room_revenue: 0,
    dining_revenue: 0,
    bookings_count: 0,
    orders_count: 0,
    customers_count: 0,
    rooms_count: 0
  });
  const [trends, setTrends] = useState([]);
  const [topRoomTypes, setTopRoomTypes] = useState([]);
  const [topFoodItems, setTopFoodItems] = useState([]);

  const fetchSummaryReport = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getSummaryReportStats();
      if (response.data?.status === 'success') {
        setStats(response.data.stats || {});
        setTrends(response.data.monthly_trends || []);
        setTopRoomTypes(response.data.top_room_types || []);
        setTopFoodItems(response.data.top_food_items || []);
      } else {
        toast.error('Failed to fetch summary report statistics');
      }
    } catch (error) {
      console.error('Error fetching summary stats:', error);
      toast.error('Error loading summary report');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSummaryReport();
  }, []);

  const handleExport = () => {
    // Generate a workbook with multiple sheets!
    const workbook = XLSX.utils.book_new();

    // Sheet 1: KPIs
    const kpis = [
      { Metric: "Total Consolidated Revenue (INR)", Value: stats.total_revenue },
      { Metric: "Room Reservation Revenue (INR)", Value: stats.room_revenue },
      { Metric: "Dining Order Revenue (INR)", Value: stats.dining_revenue },
      { Metric: "Total Room Bookings Count", Value: stats.bookings_count },
      { Metric: "Total Food Orders Count", Value: stats.orders_count },
      { Metric: "Total Customers Registered", Value: stats.customers_count },
      { Metric: "Total Rooms Count", Value: stats.rooms_count }
    ];
    const wsKpis = XLSX.utils.json_to_sheet(kpis);
    XLSX.utils.book_append_sheet(workbook, wsKpis, "Consolidated KPIs");

    // Sheet 2: Monthly Trends
    const trendsData = trends.map(t => ({
      Month: t.month,
      "Room Revenue (INR)": t.room_revenue,
      "Dining Revenue (INR)": t.dining_revenue,
      "Combined Total (INR)": t.total
    }));
    const wsTrends = XLSX.utils.json_to_sheet(trendsData);
    XLSX.utils.book_append_sheet(workbook, wsTrends, "Monthly Revenue");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `Hotel_Executive_Summary_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Consolidated executive report exported successfully!");
  };

  // SVG Chart Computations
  const maxMonthlyVal = trends.length > 0 ? Math.max(...trends.map(t => t.total), 1000) : 1000;
  
  // Chart dimensions
  const chartWidth = 550;
  const chartHeight = 220;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;
  
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  // Calculate coordinates for Y-axis markers
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  const getBarHeight = (value) => {
    return (value / maxMonthlyVal) * plotHeight;
  };

  const getRoomDiningSplit = () => {
    const total = stats.room_revenue + stats.dining_revenue;
    if (total === 0) return { room: 50, dining: 50 };
    return {
      room: Math.round((stats.room_revenue / total) * 100),
      dining: Math.round((stats.dining_revenue / total) * 100)
    };
  };

  const split = getRoomDiningSplit();

  return (
    <div className={styles.container}>
      <ToastContainer theme="colored" />
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Executive Summary Report</h2>
          <p className={styles.subtitle}>Consolidated overview of hotel performance, room usage, and dining metrics</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryButton} onClick={handleExport}>
            💾 Export Consolidated Excel
          </button>
        </div>
      </div>

      {/* KPI Stats cards */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.gradientGreen}`}>
          <span className={styles.kpiLabel}>Total Combined Revenue</span>
          <span className={styles.kpiValue}>₹{stats.total_revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          <span className={styles.kpiSub}>Rooms (₹{stats.room_revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}) + Dining (₹{stats.dining_revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })})</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Reservations placed</span>
          <span className={styles.kpiValue}>{stats.bookings_count}</span>
          <span className={styles.kpiSub}>Total room bookings</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Restaurant orders</span>
          <span className={styles.kpiValue}>{stats.orders_count}</span>
          <span className={styles.kpiSub}>Dining & Room service orders</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Registered Customers</span>
          <span className={styles.kpiValue}>{stats.customers_count}</span>
          <span className={styles.kpiSub}>Guests in directory</span>
        </div>
      </div>

      {/* Charts Layout */}
      <div className={styles.chartsGrid}>
        {/* Monthly Revenue Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>📊 Monthly Revenue Trends (Last 6 Months)</h3>
          {loading ? (
            <div className={styles.chartLoading}>Loading trends...</div>
          ) : trends.length > 0 ? (
            <div className={styles.chartContainer}>
              <svg className={styles.svgChart} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                {/* Grid lines & Y labels */}
                {yTicks.map((t, idx) => {
                  const yVal = paddingTop + plotHeight - (t * plotHeight);
                  const labelVal = Math.round(t * maxMonthlyVal);
                  return (
                    <g key={idx}>
                      <line 
                        x1={paddingLeft} 
                        y1={yVal} 
                        x2={chartWidth - paddingRight} 
                        y2={yVal} 
                        stroke="#e2e8f0" 
                        strokeWidth="1" 
                        strokeDasharray="4,4"
                      />
                      <text 
                        x={paddingLeft - 8} 
                        y={yVal + 4} 
                        textAnchor="end" 
                        fontSize="9" 
                        fill="#64748b"
                        fontWeight="600"
                      >
                        ₹{labelVal >= 1000 ? `${(labelVal / 1000).toFixed(0)}k` : labelVal}
                      </text>
                    </g>
                  );
                })}

                {/* Bars */}
                {trends.map((t, idx) => {
                  const barGroupWidth = plotWidth / trends.length;
                  const groupX = paddingLeft + (idx * barGroupWidth);
                  const centerX = groupX + (barGroupWidth / 2);
                  
                  const barWidth = 14;
                  const roomBarHeight = getBarHeight(t.room_revenue);
                  const diningBarHeight = getBarHeight(t.dining_revenue);
                  
                  const roomX = centerX - barWidth - 2;
                  const diningX = centerX + 2;
                  
                  const roomY = paddingTop + plotHeight - roomBarHeight;
                  const diningY = paddingTop + plotHeight - diningBarHeight;

                  return (
                    <g key={idx} className={styles.barGroup}>
                      {/* Room Revenue Bar (Green) */}
                      <rect 
                        x={roomX} 
                        y={roomY} 
                        width={barWidth} 
                        height={roomBarHeight} 
                        fill="#39ab49" 
                        rx="3"
                      />
                      {/* Dining Revenue Bar (Purple) */}
                      <rect 
                        x={diningX} 
                        y={diningY} 
                        width={barWidth} 
                        height={diningBarHeight} 
                        fill="#6b21a8" 
                        rx="3"
                      />
                      {/* X Label */}
                      <text 
                        x={centerX} 
                        y={chartHeight - paddingBottom + 18} 
                        textAnchor="middle" 
                        fontSize="10" 
                        fill="#475569"
                        fontWeight="600"
                      >
                        {t.month}
                      </text>
                    </g>
                  );
                })}

                {/* Baseline */}
                <line 
                  x1={paddingLeft} 
                  y1={paddingTop + plotHeight} 
                  x2={chartWidth - paddingRight} 
                  y2={paddingTop + plotHeight} 
                  stroke="#cbd5e1" 
                  strokeWidth="1.5"
                />
              </svg>
              {/* Legend */}
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ backgroundColor: '#39ab49' }}></span>
                  <span className={styles.legendLabel}>Room Bookings</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ backgroundColor: '#6b21a8' }}></span>
                  <span className={styles.legendLabel}>Dining Orders</span>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.chartLoading}>No revenue history records found.</div>
          )}
        </div>

        {/* Revenue Split Card */}
        <div className={styles.splitCard}>
          <h3 className={styles.chartTitle}>🍩 Revenue Share Split</h3>
          <div className={styles.splitContainer}>
            <div className={styles.splitVisualizer}>
              <div className={styles.pieContainer}>
                {/* Simple Circular Progress Split */}
                <div 
                  className={styles.pieSegment} 
                  style={{
                    background: `conic-gradient(#39ab49 0% ${split.room}%, #6b21a8 ${split.room}% 100%)`
                  }}
                >
                  <div className={styles.pieInnerCircle}>
                    <span className={styles.pieCenterText}>₹{stats.total_revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    <span className={styles.pieCenterLabel}>Total Share</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.splitDetails}>
              <div className={styles.splitDetailRow}>
                <span className={styles.legendColor} style={{ backgroundColor: '#39ab49' }}></span>
                <span className={styles.splitDetailName}>Room Revenue ({split.room}%)</span>
                <span className={styles.splitDetailValue}>₹{stats.room_revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className={styles.splitDetailRow}>
                <span className={styles.legendColor} style={{ backgroundColor: '#6b21a8' }}></span>
                <span className={styles.splitDetailName}>Dining Revenue ({split.dining}%)</span>
                <span className={styles.splitDetailValue}>₹{stats.dining_revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Categories Grid */}
      <div className={styles.topTablesGrid}>
        {/* Top Room Types */}
        <div className={styles.topTableCard}>
          <h3 className={styles.tableCardTitle}>⭐ Best Performing Room Types</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.topTable}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Room Category</th>
                  <th style={{ textAlign: 'right' }}>Total Sales (INR)</th>
                </tr>
              </thead>
              <tbody>
                {topRoomTypes.length === 0 ? (
                  <tr>
                    <td colSpan="3" className={styles.emptyTable}>No bookings data available.</td>
                  </tr>
                ) : (
                  topRoomTypes.map((rt, idx) => (
                    <tr key={idx}>
                      <td className={styles.rankCell}><span className={styles.greenRank}>{idx + 1}</span></td>
                      <td className={styles.textBold}>{rt.name}</td>
                      <td className={styles.amountValue}>₹{rt.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Food Items */}
        <div className={styles.topTableCard}>
          <h3 className={styles.tableCardTitle}>🔥 Best Selling Food Items</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.topTable}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Food Item</th>
                  <th style={{ textAlign: 'right' }}>Quantity Sold</th>
                </tr>
              </thead>
              <tbody>
                {topFoodItems.length === 0 ? (
                  <tr>
                    <td colSpan="3" className={styles.emptyTable}>No orders data available.</td>
                  </tr>
                ) : (
                  topFoodItems.map((fi, idx) => (
                    <tr key={idx}>
                      <td className={styles.rankCell}><span className={styles.purpleRank}>{idx + 1}</span></td>
                      <td className={styles.textBold}>{fi.name}</td>
                      <td className={styles.amountValue} style={{ color: '#1e293b' }}>{fi.value} portions</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryReport;
