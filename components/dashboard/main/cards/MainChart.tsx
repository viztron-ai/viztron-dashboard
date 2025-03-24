'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HiOutlineVideoCamera, 
  HiOutlineShieldCheck, 
  HiOutlineCog6Tooth,
  HiOutlineBattery50,
  HiOutlineWifi,
  HiOutlineExclamationTriangle,
  HiOutlineSignal,
  HiOutlineCloudArrowUp,
  HiOutlineArrowTrendingUp,
  HiOutlineEye,
  HiOutlineMap
} from 'react-icons/hi2';
import { 
  RiRadarLine,
  RiPulseLine,
  RiComputerLine,
  RiAlarmWarningLine
} from 'react-icons/ri';

// Dummy data for the dashboard
const deviceStats = {
  drones: {
    total: 16,
    active: 12,
    maintenance: 3,
    offline: 1,
    batteryAvg: 68,
    signalStrength: 85,
    dataUploaded: '2.4 TB',
    flightHours: 1247
  },
  cameras: {
    total: 64,
    active: 58,
    maintenance: 4,
    offline: 2,
    batteryAvg: 72,
    signalStrength: 92,
    dataUploaded: '8.7 TB',
    storageUsed: '64%'
  },
  sentries: {
    total: 24,
    active: 22,
    maintenance: 1,
    offline: 1,
    batteryAvg: 81,
    signalStrength: 88,
    perimeter: '12.4 km',
    alerts: 17
  }
};

// Recent alerts dummy data
const recentAlerts = [
  { 
    id: 1, 
    type: 'Perimeter Breach', 
    device: 'Sentry-08', 
    location: 'North Gate', 
    time: '10 min ago', 
    severity: 'high' 
  },
  { 
    id: 2, 
    type: 'Low Battery', 
    device: 'Drone-03', 
    location: 'Sector B', 
    time: '25 min ago', 
    severity: 'medium' 
  },
  { 
    id: 3, 
    type: 'Connection Lost', 
    device: 'Camera-42', 
    location: 'Warehouse', 
    time: '48 min ago', 
    severity: 'medium' 
  },
  { 
    id: 4, 
    type: 'Motion Detected', 
    device: 'Camera-17', 
    location: 'Parking Lot', 
    time: '1 hr ago', 
    severity: 'low' 
  },
  { 
    id: 5, 
    type: 'Maintenance Due', 
    device: 'Drone-11', 
    location: 'Base Station', 
    time: '2 hrs ago', 
    severity: 'low' 
  }
];

// Mock activity chart (visual representation without actual chart library)
const MockActivityChart = () => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-black/80 p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-700/10"></div>
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-4 flex justify-between text-xs text-zinc-400">
          <div>00:00</div>
          <div>06:00</div>
          <div>12:00</div>
          <div>18:00</div>
          <div>24:00</div>
        </div>
        
        <div className="flex-1 flex flex-col justify-end space-y-6">
          {/* Drone activity line (glowing) */}
          <div className="relative h-16">
            <div className="absolute bottom-0 left-0 right-0 h-1/2 rounded-full bg-gradient-to-r from-indigo-600/20 to-blue-500/20"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 shadow-[0_0_10px_rgba(99,102,241,0.7),0_0_20px_rgba(99,102,241,0.4)]"></div>
            <div className="absolute bottom-0 h-2 w-2 translate-x-[75%] rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1),0_0_30px_rgba(99,102,241,0.7)]"></div>
            <div className="absolute bottom-1 left-2 text-[10px] font-medium text-indigo-400">Drones</div>
          </div>
          
          {/* Camera activity line (glowing) */}
          <div className="relative h-24">
            <div className="absolute bottom-0 left-0 right-0 h-3/4 rounded-full bg-gradient-to-r from-cyan-600/20 to-blue-400/20"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-cyan-600 to-blue-400 shadow-[0_0_10px_rgba(14,165,233,0.7),0_0_20px_rgba(14,165,233,0.4)]"></div>
            <div className="absolute bottom-0 h-2 w-2 translate-x-[60%] rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(14,165,233,1),0_0_30px_rgba(14,165,233,0.7)]"></div>
            <div className="absolute bottom-1 left-2 text-[10px] font-medium text-cyan-400">Cameras</div>
          </div>
          
          {/* Sentry activity line (glowing) */}
          <div className="relative h-10">
            <div className="absolute bottom-0 left-0 right-0 h-3/4 rounded-full bg-gradient-to-r from-emerald-600/20 to-green-400/20"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-emerald-600 to-green-400 shadow-[0_0_10px_rgba(34,197,94,0.7),0_0_20px_rgba(34,197,94,0.4)]"></div>
            <div className="absolute bottom-0 h-2 w-2 translate-x-[40%] rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(34,197,94,1),0_0_30px_rgba(34,197,94,0.7)]"></div>
            <div className="absolute bottom-1 left-2 text-[10px] font-medium text-emerald-400">Sentries</div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-7 gap-1 border-t border-zinc-800 pt-2">
          {[12, 8, 15, 7, 9, 4, 6].map((value, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-full rounded-sm bg-red-500/80"
                style={{ height: `${value * 4}px` }}
              ></div>
              <div className="mt-1 text-[8px] text-zinc-500">{["M", "T", "W", "T", "F", "S", "S"][index]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Device status card component with neomorphic design
const DeviceStatusCard = ({ title, icon, stats, color, glowColor }) => {
  return (
    <Card className="relative overflow-hidden border-zinc-200/50 bg-white/90 shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80 dark:shadow-[8px_8px_16px_#131313,-8px_-8px_16px_#272727]">
      <div className={`absolute top-0 left-0 h-1 w-full ${color}`}></div>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium text-zinc-800 dark:text-zinc-100">
          {title}
        </CardTitle>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color} ${glowColor}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white/50 p-2 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.6)] dark:bg-zinc-800/50 dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_5px_rgba(40,40,40,0.2)]">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Total</p>
            <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{stats.total}</p>
          </div>
          <div className="rounded-lg bg-white/50 p-2 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.6)] dark:bg-zinc-800/50 dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_5px_rgba(40,40,40,0.2)]">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Active</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-500">{stats.active}</p>
          </div>
          <div className="rounded-lg bg-white/50 p-2 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.6)] dark:bg-zinc-800/50 dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_5px_rgba(40,40,40,0.2)]">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Maintenance</p>
            <p className="text-2xl font-bold text-amber-500">{stats.maintenance}</p>
          </div>
          <div className="rounded-lg bg-white/50 p-2 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.6)] dark:bg-zinc-800/50 dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_5px_rgba(40,40,40,0.2)]">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Offline</p>
            <p className="text-2xl font-bold text-red-500">{stats.offline}</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-xs font-medium flex items-center">
                <HiOutlineBattery50 className="mr-1 text-zinc-500" /> Battery
              </span>
              <span className="text-xs font-medium">{stats.batteryAvg}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-zinc-200/50 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)] dark:bg-zinc-800">
              <div 
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  width: `${stats.batteryAvg}%`,
                  background: 'linear-gradient(to right, #22c55e, #eab308)',
                  boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-xs font-medium flex items-center">
                <HiOutlineSignal className="mr-1 text-zinc-500" /> Signal
              </span>
              <span className="text-xs font-medium">{stats.signalStrength}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-zinc-200/50 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)] dark:bg-zinc-800">
              <div 
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  width: `${stats.signalStrength}%`,
                  background: 'linear-gradient(to right, #6366f1, #0ea5e9)',
                  boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
                }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Alert card component with glassmorphism
const AlertCard = ({ alert }) => {
  const severityColors = {
    high: {
      bg: "bg-red-900/10",
      text: "text-red-500",
      border: "border-red-500/20",
      glow: "shadow-[0_0_15px_rgba(239,68,68,0.2)]"
    },
    medium: {
      bg: "bg-amber-900/10",
      text: "text-amber-500",
      border: "border-amber-500/20",
      glow: "shadow-[0_0_15px_rgba(245,158,11,0.2)]"
    },
    low: {
      bg: "bg-blue-900/10",
      text: "text-blue-500",
      border: "border-blue-500/20",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]"
    }
  };
  
  const style = severityColors[alert.severity];
  
  return (
    <div className={`flex items-center space-x-3 rounded-lg border ${style.border} ${style.bg} backdrop-blur-md p-3 ${style.glow}`}>
      <div className="shrink-0">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-black/40 ${style.text}`}>
          <HiOutlineExclamationTriangle className="h-4 w-4" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`truncate text-sm font-medium ${style.text}`}>
          {alert.type}
        </p>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
          {alert.device} • {alert.location}
        </p>
      </div>
      <div className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
        {alert.time}
      </div>
    </div>
  );
};

// System stat card component
const StatCard = ({ icon, title, value, subtitle, color }) => {
  return (
    <div className="space-y-1 rounded-lg bg-white/30 p-3 shadow-[3px_3px_6px_rgba(0,0,0,0.05),-3px_-3px_6px_rgba(255,255,255,0.8)] backdrop-blur-sm dark:bg-zinc-800/30 dark:shadow-[3px_3px_6px_rgba(0,0,0,0.2),-3px_-3px_6px_rgba(30,30,30,0.1)]">
      <div className={`flex items-center ${color}`}>
        {icon}
        <span className="ml-1 text-xs">{title}</span>
      </div>
      <p className="text-xl font-bold text-zinc-900 dark:text-white">{value}</p>
      <p className={`text-xs ${subtitle.includes('Uptime') ? 'text-green-600' : 'text-zinc-500 dark:text-zinc-400'}`}>
        {subtitle}
      </p>
    </div>
  );
};

// Main dashboard component
export default function IoTDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      {/* Background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10" 
        style={{
          backgroundImage: `linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      ></div>
      
      {/* Glow effects */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[120px] dark:bg-blue-500/10"></div>
      <div className="absolute right-1/4 bottom-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[120px] dark:bg-indigo-500/10"></div>
      
      <div className="relative z-10 w-full p-6 space-y-8">

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DeviceStatusCard 
            title="Surveillance Drones" 
            icon={<RiRadarLine className="h-5 w-5 text-white" />} 
            stats={deviceStats.drones} 
            color="bg-gradient-to-r from-indigo-600 to-blue-500"
            glowColor="shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          />
          <DeviceStatusCard 
            title="Security Cameras" 
            icon={<HiOutlineVideoCamera className="h-5 w-5 text-white" />} 
            stats={deviceStats.cameras} 
            color="bg-gradient-to-r from-sky-600 to-cyan-500"
            glowColor="shadow-[0_0_20px_rgba(14,165,233,0.5)]"
          />
          <DeviceStatusCard 
            title="Perimeter Sentries" 
            icon={<HiOutlineShieldCheck className="h-5 w-5 text-white" />} 
            stats={deviceStats.sentries} 
            color="bg-gradient-to-r from-emerald-600 to-green-500"
            glowColor="shadow-[0_0_20px_rgba(34,197,94,0.5)]"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-hidden border-zinc-200/50 bg-zinc-900/95 shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/90 dark:shadow-[8px_8px_16px_#131313,-8px_-8px_16px_#272727]">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center text-zinc-100">
                <RiPulseLine className="h-5 w-5 mr-2 text-blue-400" /> 
                Device Activity Monitor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px] w-full">
                <MockActivityChart />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-zinc-200/50 bg-white/90 shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80 dark:shadow-[8px_8px_16px_#131313,-8px_-8px_16px_#272727]">
              <CardHeader className="pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <CardTitle className="flex items-center text-black dark:text-zinc-100">
                  <RiAlarmWarningLine className="h-5 w-5 mr-2 text-red-500" /> 
                  Threat Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {recentAlerts.map(alert => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-zinc-200/50 bg-black shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] backdrop-blur-sm dark:border-zinc-800/50 dark:bg-black dark:shadow-[8px_8px_16px_#131313,-8px_-8px_16px_#272727]">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center text-zinc-100">
                <HiOutlineMap className="h-5 w-5 mr-2 text-cyan-400" /> 
                Security Grid
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative h-[250px] w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                {/* Simulated security grid with glowing elements */}
                <div className="absolute inset-0 opacity-30" 
                  style={{
                    backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                  }}
                ></div>
                
                {/* Camera indicators */}
                <div className="absolute top-1/4 left-1/4 h-3 w-3 rounded-full bg-sky-500 shadow-[0_0_10px_#0ea5e9,0_0_20px_rgba(14,165,233,0.5)]"></div>
                <div className="absolute top-3/4 left-2/3 h-3 w-3 rounded-full bg-sky-500 shadow-[0_0_10px_#0ea5e9,0_0_20px_rgba(14,165,233,0.5)]"></div>
                <div className="absolute top-2/3 left-1/5 h-3 w-3 rounded-full bg-sky-500 shadow-[0_0_10px_#0ea5e9,0_0_20px_rgba(14,165,233,0.5)]"></div>
                
                {/* Drone paths */}
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-indigo-600/40"></div>
                <div className="absolute top-0 bottom-0 left-1/3 w-[2px] bg-indigo-600/40"></div>
                <div className="absolute top-1/3 left-2/3 h-[2px] w-1/3 bg-indigo-600/40"></div>
                
                {/* Drone indicators */}
                <div className="absolute top-1/2 left-1/4 h-4 w-4 animate-pulse rounded-full bg-indigo-600 shadow-[0_0_10px_#6366f1,0_0_20px_rgba(99,102,241,0.5)]"></div>
                <div className="absolute top-1/3 left-2/3 h-4 w-4 animate-pulse rounded-full bg-indigo-600 shadow-[0_0_10px_#6366f1,0_0_20px_rgba(99,102,241,0.5)]"></div>
                
                {/* Perimeter outline */}
                <div className="absolute inset-4 border-2 border-dashed border-green-500/40 rounded-lg"></div>
                
                {/* Sentry indicators */}
                <div className="absolute top-[16px] left-1/2 h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e,0_0_20px_rgba(34,197,94,0.5)]"></div>
                <div className="absolute bottom-[16px] left-1/2 h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e,0_0_20px_rgba(34,197,94,0.5)]"></div>
                <div className="absolute top-1/2 left-[16px] h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e,0_0_20px_rgba(34,197,94,0.5)]"></div>
                <div className="absolute top-1/2 right-[16px] h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e,0_0_20px_rgba(34,197,94,0.5)]"></div>
                
                {/* Alert indicator */}
                <div className="absolute top-1/4 right-1/4 h-5 w-5 animate-ping rounded-full bg-red-500/50 shadow-[0_0_15px_#ef4444,0_0_30px_rgba(239,68,68,0.5)]"></div>
                <div className="absolute top-1/4 right-1/4 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444,0_0_20px_rgba(239,68,68,0.5)]"></div>
                <div className="absolute top-1/4 right-1/4 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444,0_0_20px_rgba(239,68,68,0.5)]"></div>
              </div>
              
              <div className="mt-4 flex justify-between text-xs text-zinc-500">
                <div className="flex items-center">
                  <div className="mr-1 h-2 w-2 rounded-full bg-indigo-500"></div>
                  <span className="text-indigo-400">Drones</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-1 h-2 w-2 rounded-full bg-sky-500"></div>
                  <span className="text-sky-400">Cameras</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-1 h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-green-400">Sentries</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-1 h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-red-400">Alerts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/50 bg-white/90 shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80 dark:shadow-[8px_8px_16px_#131313,-8px_-8px_16px_#272727] md:col-span-2">
            <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
              <CardTitle className="flex items-center text-black">
                <RiRadarLine className="h-5 w-5 mr-2 text-zinc-500" /> 
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                  icon={<HiOutlineWifi className="h-4 w-4" />}
                  title="Network"
                  value="99.8%"
                  subtitle="Uptime"
                  color="text-blue-500"
                />
                
                <StatCard 
                  icon={<HiOutlineCloudArrowUp className="h-4 w-4" />}
                  title="Storage"
                  value="12.8 TB"
                  subtitle="Total Used"
                  color="text-indigo-500"
                />
                
                <StatCard 
                  icon={<HiOutlineCog6Tooth className="h-4 w-4" />}
                  title="Processing"
                  value="43.2K"
                  subtitle="Events/Hour"
                  color="text-amber-500"
                />
                
                <StatCard 
                  icon={<HiOutlineSignal className="h-4 w-4" />}
                  title="Bandwidth"
                  value="2.4 GB/s"
                  subtitle="Peak Usage"
                  color="text-emerald-500"
                />
              </div>
              
              {/* Additional system metrics */}
              <div className="mt-6 rounded-lg bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-blue-900/20 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center">
                  <HiOutlineArrowTrendingUp className="mr-2 h-4 w-4 text-blue-400" />
                  <h3 className="text-sm font-medium text-blue-400">System Performance</h3>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="mb-1 flex justify-between">
                      <span className="text-xs text-zinc-400">CPU Utilization</span>
                      <span className="text-xs text-zinc-400">37%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-800">
                      <div className="h-full w-[37%] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-1 flex justify-between">
                      <span className="text-xs text-zinc-400">Memory Usage</span>
                      <span className="text-xs text-zinc-400">62%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-800">
                      <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-1 flex justify-between">
                      <span className="text-xs text-zinc-400">Network Load</span>
                      <span className="text-xs text-zinc-400">44%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-800">
                      <div className="h-full w-[44%] rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bottom status cards with key metrics */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-zinc-200/50 bg-white/90 shadow-[4px_4px_8px_#d9d9d9,-4px_-4px_8px_#ffffff] backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80 dark:shadow-[4px_4px_8px_#131313,-4px_-4px_8px_#272727]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Devices</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">{deviceStats.drones.total + deviceStats.cameras.total + deviceStats.sentries.total}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600/10 to-blue-500/10 p-3 dark:from-indigo-600/20 dark:to-blue-500/20">
                  <HiOutlineEye className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-zinc-200/50 bg-white/90 shadow-[4px_4px_8px_#d9d9d9,-4px_-4px_8px_#ffffff] backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80 dark:shadow-[4px_4px_8px_#131313,-4px_-4px_8px_#272727]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Perimeter Length</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">{deviceStats.sentries.perimeter}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-600/10 to-emerald-500/10 p-3 dark:from-green-600/20 dark:to-emerald-500/20">
                  <HiOutlineMap className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-zinc-200/50 bg-white/90 shadow-[4px_4px_8px_#d9d9d9,-4px_-4px_8px_#ffffff] backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80 dark:shadow-[4px_4px_8px_#131313,-4px_-4px_8px_#272727]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Drone Flight Hours</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">{deviceStats.drones.flightHours}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600/10 to-cyan-500/10 p-3 dark:from-blue-600/20 dark:to-cyan-500/20">
                  <RiRadarLine className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-zinc-200/50 bg-white/90 shadow-[4px_4px_8px_#d9d9d9,-4px_-4px_8px_#ffffff] backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80 dark:shadow-[4px_4px_8px_#131313,-4px_-4px_8px_#272727]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Alerts</p>
                  <p className="text-2xl font-bold text-red-500">{deviceStats.sentries.alerts}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-600/10 to-orange-500/10 p-3 dark:from-red-600/20 dark:to-orange-500/20">
                  <HiOutlineExclamationTriangle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Additional visualization section */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* Camera feed grid - spans 7 columns */}
          <Card className="border-zinc-200/50 bg-black shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] backdrop-blur-sm dark:border-zinc-800/50 dark:bg-black dark:shadow-[8px_8px_16px_#131313,-8px_-8px_16px_#272727] md:col-span-7">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center text-zinc-100">
                <HiOutlineVideoCamera className="h-5 w-5 mr-2 text-sky-400" /> 
                Live Camera Feeds
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Camera feed 1 */}
                <div className="relative rounded-lg bg-zinc-900 aspect-video overflow-hidden border border-zinc-800">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/30 to-transparent"></div>
                  </div>
                  <div className="absolute top-2 left-2 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                    <span className="text-xs text-sky-400">Camera-12</span>
                  </div>
                  <div className="absolute bottom-2 left-2 text-xs text-zinc-500">Main Entrance</div>
                  <div className="absolute bottom-2 right-2 text-xs text-zinc-500">Live</div>
                </div>
                
                {/* Camera feed 2 */}
                <div className="relative rounded-lg bg-zinc-900 aspect-video overflow-hidden border border-zinc-800">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/30 to-transparent"></div>
                  </div>
                  <div className="absolute top-2 left-2 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                    <span className="text-xs text-sky-400">Camera-23</span>
                  </div>
                  <div className="absolute bottom-2 left-2 text-xs text-zinc-500">Parking Lot</div>
                  <div className="absolute bottom-2 right-2 text-xs text-zinc-500">Live</div>
                </div>
                
                {/* Camera feed 3 */}
                <div className="relative rounded-lg bg-zinc-900 aspect-video overflow-hidden border border-zinc-800">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/30 to-transparent"></div>
                  </div>
                  <div className="absolute top-2 left-2 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                    <span className="text-xs text-sky-400">Camera-38</span>
                  </div>
                  <div className="absolute bottom-2 left-2 text-xs text-zinc-500">Warehouse</div>
                  <div className="absolute bottom-2 right-2 text-xs text-zinc-500">Live</div>
                </div>
                
                {/* Camera feed 4 */}
                <div className="relative rounded-lg bg-zinc-900 aspect-video overflow-hidden border border-zinc-800">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/30 to-transparent"></div>
                  </div>
                  <div className="absolute top-2 left-2 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-2"></div>
                    <span className="text-xs text-sky-400">Camera-42</span>
                  </div>
                  <div className="absolute bottom-2 left-2 text-xs text-zinc-500">North Gate</div>
                  <div className="absolute bottom-2 right-2 text-xs text-red-400">Connection Lost</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Drone patrol section - spans 5 columns */}
          <Card className="border-zinc-200/50 bg-gradient-to-br from-indigo-900/80 to-blue-900/80 shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] backdrop-blur-sm dark:border-zinc-800/50 dark:from-indigo-900/60 dark:to-blue-900/60 dark:shadow-[8px_8px_16px_#131313,-8px_-8px_16px_#272727] md:col-span-5">
            <CardHeader className="border-b border-indigo-800/50">
              <CardTitle className="flex items-center text-zinc-100">
                <RiRadarLine className="h-5 w-5 mr-2 text-indigo-400" /> 
                Drone Patrol Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Drone status cards */}
                <div className="flex items-center space-x-4 rounded-lg bg-white/5 p-3 backdrop-blur-md border border-indigo-500/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
                    <RiRadarLine className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-indigo-300">Drone-03</p>
                      <span className="rounded-full bg-green-900/30 px-2 py-0.5 text-xs text-green-400">Active</span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-xs text-zinc-400">
                      <span className="flex items-center">
                        <HiOutlineMap className="mr-1 h-3 w-3" /> Sector B
                      </span>
                      <span className="flex items-center">
                        <HiOutlineBattery50 className="mr-1 h-3 w-3" /> 62%
                      </span>
                      <span className="flex items-center">
                        <HiOutlineSignal className="mr-1 h-3 w-3" /> 95%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400">Flight time</p>
                    <p className="text-lg font-bold text-indigo-300">2:47:12</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 rounded-lg bg-white/5 p-3 backdrop-blur-md border border-indigo-500/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
                    <RiRadarLine className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-indigo-300">Drone-08</p>
                      <span className="rounded-full bg-green-900/30 px-2 py-0.5 text-xs text-green-400">Active</span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-xs text-zinc-400">
                      <span className="flex items-center">
                        <HiOutlineMap className="mr-1 h-3 w-3" /> Sector D
                      </span>
                      <span className="flex items-center">
                        <HiOutlineBattery50 className="mr-1 h-3 w-3" /> 87%
                      </span>
                      <span className="flex items-center">
                        <HiOutlineSignal className="mr-1 h-3 w-3" /> 88%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400">Flight time</p>
                    <p className="text-lg font-bold text-indigo-300">1:05:43</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 rounded-lg bg-white/5 p-3 backdrop-blur-md border border-amber-500/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                    <RiRadarLine className="h-6 w-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-amber-300">Drone-11</p>
                      <span className="rounded-full bg-amber-900/30 px-2 py-0.5 text-xs text-amber-400">Maintenance</span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-xs text-zinc-400">
                      <span className="flex items-center">
                        <HiOutlineMap className="mr-1 h-3 w-3" /> Base Station
                      </span>
                      <span className="flex items-center">
                        <HiOutlineBattery50 className="mr-1 h-3 w-3" /> 23%
                      </span>
                      <span className="flex items-center">
                        <HiOutlineSignal className="mr-1 h-3 w-3" /> 100%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400">Status</p>
                    <p className="text-lg font-bold text-amber-300">Charging</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}