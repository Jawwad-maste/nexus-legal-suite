
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileText, Calendar, TrendingUp, Bell, Search, User, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStats {
  totalCases: number;
  totalClients: number;
  upcomingHearings: number;
  teamMembers: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', cases: 12, clients: 8 },
    { month: 'Feb', cases: 19, clients: 12 },
    { month: 'Mar', cases: 15, clients: 10 },
    { month: 'Apr', cases: 25, clients: 18 },
    { month: 'May', cases: 32, clients: 24 },
    { month: 'Jun', cases: 28, clients: 20 }
  ];

  const caseStatusData = [
    { name: 'Active', value: 45, color: '#F7CAC9' },
    { name: 'Pending', value: 20, color: '#57687c' },
    { name: 'Closed', value: 35, color: '#2C3E50' }
  ];

  const fetchDashboardStats = async (): Promise<DashboardStats> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalCases: 142,
          totalClients: 89,
          upcomingHearings: 12,
          teamMembers: 8
        });
      }, 1500);
    });
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, description, isLoading }: {
    title: string;
    value: number;
    icon: any;
    description: string;
    isLoading: boolean;
  }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white hover:shadow-lg transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-text-200">{title}</CardTitle>
          <Icon className="h-4 w-4 text-primary-200" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-8 bg-bg-200 rounded animate-pulse"></div>
              <div className="h-4 bg-bg-200 rounded animate-pulse w-3/4"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-text-100">{value.toLocaleString()}</div>
              <p className="text-xs text-text-200">{description}</p>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-bg-100">
      {/* Top Bar */}
      <header className="bg-white border-b border-bg-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-text-100">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-200 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-bg-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-100 text-sm"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-text-200 hover:text-text-100 hover:bg-bg-100 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-100 rounded-full animate-pulse"></span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-text-200 hover:text-text-100 hover:bg-bg-100 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Cases"
            value={stats?.totalCases || 0}
            icon={FileText}
            description="+12% from last month"
            isLoading={isLoading}
          />
          <StatCard
            title="Active Clients"
            value={stats?.totalClients || 0}
            icon={Users}
            description="+8% from last month"
            isLoading={isLoading}
          />
          <StatCard
            title="Upcoming Hearings"
            value={stats?.upcomingHearings || 0}
            icon={Calendar}
            description="Next 30 days"
            isLoading={isLoading}
          />
          <StatCard
            title="Team Members"
            value={stats?.teamMembers || 0}
            icon={TrendingUp}
            description="Active members"
            isLoading={isLoading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-text-100">Monthly Progress</CardTitle>
                <CardDescription>Cases and clients over time</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 bg-bg-200 rounded animate-pulse"></div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                      <XAxis dataKey="month" stroke="#5c5c5c" />
                      <YAxis stroke="#5c5c5c" />
                      <Tooltip />
                      <Bar dataKey="cases" fill="#F7CAC9" name="Cases" />
                      <Bar dataKey="clients" fill="#2C3E50" name="Clients" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Case Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-text-100">Case Status Distribution</CardTitle>
                <CardDescription>Current case status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 bg-bg-200 rounded animate-pulse"></div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={caseStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {caseStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="flex justify-center space-x-4 mt-4">
                  {caseStatusData.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-text-200">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-text-100">Recent Activity</CardTitle>
              <CardDescription>Latest updates across your cases</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-bg-200 rounded-full animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-bg-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-bg-200 rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { action: 'New case assigned', case: 'Johnson vs. ABC Corp', time: '2 hours ago' },
                    { action: 'Document uploaded', case: 'Smith Family Trust', time: '4 hours ago' },
                    { action: 'Hearing scheduled', case: 'Estate Planning - Davis', time: '1 day ago' },
                    { action: 'Client meeting completed', case: 'Wilson Contract Dispute', time: '2 days ago' },
                    { action: 'Case status updated', case: 'Thompson Divorce', time: '3 days ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 hover:bg-bg-100 rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary-100" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-text-100">{activity.action}</p>
                        <p className="text-sm text-text-200">{activity.case}</p>
                      </div>
                      <span className="text-xs text-text-200">{activity.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
