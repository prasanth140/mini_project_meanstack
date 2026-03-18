const RequestLog = require('../models/RequestLog');

// @desc    Get all logs
// @route   GET /api/logs
// @access  Private
const getLogs = async (req, res) => {
  try {
    const logs = await RequestLog.find({}).sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get monitoring statistics
// @route   GET /api/logs/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const totalRequests = await RequestLog.countDocuments();
    const successfulRequests = await RequestLog.countDocuments({ status: { $gte: 200, $lt: 300 } });
    const failedRequests = await RequestLog.countDocuments({ status: { $gte: 400 } });
    
    // Average response time
    const avgResponseTime = await RequestLog.aggregate([
      { $group: { _id: null, avgTime: { $avg: "$responseTime" } } }
    ]);

    // Daily activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await RequestLog.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 },
          success: { $sum: { $cond: [{ $and: [{ $gte: ["$status", 200] }, { $lt: ["$status", 300] }] }, 1, 0] } },
          failure: { $sum: { $cond: [{ $gte: ["$status", 400] }, 1, 0] } }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    console.log(`Stats requested: ${totalRequests} total, ${successfulRequests} success, ${failedRequests} failure`);

    res.json({
      total: totalRequests,
      success: successfulRequests,
      failure: failedRequests,
      avgResponseTime: avgResponseTime.length > 0 ? Math.round(avgResponseTime[0].avgTime) : 0,
      dailyStats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Export logs as CSV
// @route   GET /api/logs/export
// @access  Private
const exportLogs = async (req, res) => {
  try {
    const logs = await RequestLog.find({}).sort({ timestamp: -1 });
    
    let csv = 'Service,Method,Endpoint,Status,Latency(ms),Timestamp\n';
    logs.forEach(log => {
      csv += `"${log.serviceName}","${log.method}","${log.endpoint}",${log.status},${log.responseTime},"${log.timestamp}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('servicehub_logs.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLogs, getStats, exportLogs };
