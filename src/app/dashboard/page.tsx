'use client'

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Activity, 
  Users, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  Building,
  Plus,
  BarChart3
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { apiService, DashboardStats } from "@/services/api"

// Fallback data in case API is not available
const fallbackData: DashboardStats = {
  totalMerchants: 1247,
  activeMerchants: 1189,
  posCompanies: 23,
  activeAccessGrants: 892,
  merchantGrowth: [
    { month: 'Jan', merchants: 850 },
    { month: 'Feb', merchants: 920 },
    { month: 'Mar', merchants: 980 },
    { month: 'Apr', merchants: 1050 },
    { month: 'May', merchants: 1120 },
    { month: 'Jun', merchants: 1189 },
  ]
}

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<DashboardStats>(fallbackData)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user) {
        try {
          setIsLoadingData(true)
          const stats = await apiService.getDashboardStats()
          setData(stats)
        } catch (error) {
          console.error('Failed to fetch dashboard stats:', error)
          // Keep fallback data if API fails
        } finally {
          setIsLoadingData(false)
        }
      }
    }

    fetchDashboardData()
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">MerchantHub</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}! Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Merchant
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingData ? (
                  <div className="animate-pulse bg-muted h-8 w-20 rounded"></div>
                ) : (
                  data.totalMerchants.toLocaleString()
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{data.totalMerchants - 1000}</span> total registered
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Merchants</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingData ? (
                  <div className="animate-pulse bg-muted h-8 w-20 rounded"></div>
                ) : (
                  data.activeMerchants.toLocaleString()
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{Math.round(data.activeMerchants * 0.15)}</span> this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">POS Companies</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingData ? (
                  <div className="animate-pulse bg-muted h-8 w-16 rounded"></div>
                ) : (
                  data.posCompanies
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+3</span> new integrations
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Access Grants</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingData ? (
                  <div className="animate-pulse bg-muted h-8 w-20 rounded"></div>
                ) : (
                  data.activeAccessGrants.toLocaleString()
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{Math.round(data.activeAccessGrants * 0.08)}</span> this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Merchant Growth Chart
              </CardTitle>
              <CardDescription>
                Monthly merchant registration trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingData ? (
                  <div className="flex items-end justify-between h-48 space-x-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex flex-col items-center space-y-2">
                        <div className="w-8 bg-muted animate-pulse rounded-t-sm h-32"></div>
                        <div className="w-8 h-3 bg-muted animate-pulse rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Simple bar chart visualization */}
                    <div className="flex items-end justify-between h-48 space-x-2">
                      {data.merchantGrowth.map((item, index) => (
                        <div key={item.month} className="flex flex-col items-center space-y-2">
                          <div 
                            className="w-8 bg-primary rounded-t-sm transition-all duration-300 hover:bg-primary/80"
                            style={{ 
                              height: `${(item.merchants / Math.max(...data.merchantGrowth.map(d => d.merchants))) * 100}%` 
                            }}
                          />
                          <span className="text-xs text-muted-foreground">{item.month}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Chart legend */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total growth: +{data.merchantGrowth[data.merchantGrowth.length - 1].merchants - data.merchantGrowth[0].merchants} merchants
                      </span>
                      <span className="text-green-600 font-medium">
                        +{Math.round(((data.merchantGrowth[data.merchantGrowth.length - 1].merchants - data.merchantGrowth[0].merchants) / data.merchantGrowth[0].merchants) * 100)}% growth
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your merchant ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Merchants
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Building className="mr-2 h-4 w-4" />
                POS Companies
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Activity className="mr-2 h-4 w-4" />
                Customer Merchant Access
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest merchant and access management activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New merchant registered
                    </p>
                    <p className="text-sm text-muted-foreground">
                      "Tech Solutions Inc" joined the platform
                    </p>
                  </div>
                  <Badge variant="secondary">2 min ago</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Access granted
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Customer access granted to "Retail Store #123"
                    </p>
                  </div>
                  <Badge variant="secondary">1 hour ago</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      POS integration completed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      "PaymentPro" integration for "Food Court LLC"
                    </p>
                  </div>
                  <Badge variant="secondary">3 hours ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
