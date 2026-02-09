import * as statsService from '../../service/admin/stats.service';


// Dashboard Stats Controller
export const getDashboardData = async (req: any, res: any) => {
  try {
    const stats = await statsService.getDashboardStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard stats' 
    });
  }
};