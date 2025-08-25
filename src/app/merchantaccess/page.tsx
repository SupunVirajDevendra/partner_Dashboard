'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Shield, Search, User, Building, Calendar, Trash2 } from 'lucide-react'
import { apiService, AccessGrant, GrantAccessRequest } from '@/services/api'

export default function MerchantAccessPage() {
  const [accessGrants, setAccessGrants] = useState<AccessGrant[]>([])
  const [merchants, setMerchants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isGrantDialogOpen, setIsGrantDialogOpen] = useState(false)
  const [formData, setFormData] = useState<GrantAccessRequest>({
    customerId: '',
    merchantId: ''
  })

  useEffect(() => {
    fetchAccessGrants()
    fetchMerchants()
  }, [])

  const fetchAccessGrants = async () => {
    try {
      setIsLoading(true)
      // For demo, we'll use mock data since we need a specific user ID
      const mockAccessGrants: AccessGrant[] = [
        {
          id: '1',
          customerId: 'customer-001',
          merchantId: 'merchant-001',
          status: 'active',
          grantedAt: '2024-01-15T10:00:00Z',
          revokedAt: undefined
        },
        {
          id: '2',
          customerId: 'customer-002',
          merchantId: 'merchant-002',
          status: 'active',
          grantedAt: '2024-01-12T14:30:00Z',
          revokedAt: undefined
        },
        {
          id: '3',
          customerId: 'customer-003',
          merchantId: 'merchant-001',
          status: 'revoked',
          grantedAt: '2024-01-10T09:15:00Z',
          revokedAt: '2024-01-14T16:45:00Z'
        }
      ]
      setAccessGrants(mockAccessGrants)
    } catch (error) {
      console.error('Failed to fetch access grants:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMerchants = async () => {
    try {
      const data = await apiService.getMerchants()
      setMerchants(data)
    } catch (error) {
      console.error('Failed to fetch merchants:', error)
      // Mock merchants for demo
      setMerchants([
        { id: 'merchant-001', name: 'Tech Solutions Inc' },
        { id: 'merchant-002', name: 'Retail Store #123' },
        { id: 'merchant-003', name: 'Food Court LLC' }
      ])
    }
  }

  const handleGrantAccess = async () => {
    try {
      await apiService.grantAccess(formData)
      setIsGrantDialogOpen(false)
      setFormData({ customerId: '', merchantId: '' })
      fetchAccessGrants()
    } catch (error) {
      console.error('Failed to grant access:', error)
    }
  }

  const handleRevokeAccess = async (accessId: string) => {
    if (confirm('Are you sure you want to revoke this access?')) {
      try {
        await apiService.revokeAccess(accessId)
        fetchAccessGrants()
      } catch (error) {
        console.error('Failed to revoke access:', error)
      }
    }
  }

  const filteredAccessGrants = accessGrants.filter(grant => {
    const matchesSearch = grant.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grant.merchantId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || grant.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'revoked':
        return <Badge className="bg-red-100 text-red-800">Revoked</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getMerchantName = (merchantId: string) => {
    const merchant = merchants.find(m => m.id === merchantId)
    return merchant ? merchant.name : merchantId
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Merchant Access</h1>
            <p className="text-muted-foreground">
              Manage customer access to merchant data and services
            </p>
          </div>
          <Dialog open={isGrantDialogOpen} onOpenChange={setIsGrantDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Grant Access
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Grant Customer Access</DialogTitle>
                <DialogDescription>
                  Grant a customer access to a specific merchant
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerId">Customer ID</Label>
                  <Input
                    id="customerId"
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    placeholder="Enter customer ID"
                  />
                </div>
                <div>
                  <Label htmlFor="merchantId">Merchant</Label>
                  <Select value={formData.merchantId} onValueChange={(value) => setFormData({ ...formData, merchantId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a merchant" />
                    </SelectTrigger>
                    <SelectContent>
                      {merchants.map((merchant) => (
                        <SelectItem key={merchant.id} value={merchant.id}>
                          {merchant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGrantDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGrantAccess}>Grant Access</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Access Grants</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accessGrants.length}</div>
              <p className="text-xs text-muted-foreground">
                All access permissions
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Access</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accessGrants.filter(g => g.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revoked Access</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accessGrants.filter(g => g.status === 'revoked').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Previously revoked
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(accessGrants.map(g => g.customerId)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                With access grants
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by customer or merchant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Grants Table */}
        <Card>
          <CardHeader>
            <CardTitle>Access Grants List</CardTitle>
            <CardDescription>
              {filteredAccessGrants.length} access grants found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading access grants...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Granted</TableHead>
                    <TableHead>Revoked</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccessGrants.map((grant) => (
                    <TableRow key={grant.id}>
                      <TableCell className="font-medium">{grant.customerId}</TableCell>
                      <TableCell>{getMerchantName(grant.merchantId)}</TableCell>
                      <TableCell>{getStatusBadge(grant.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {new Date(grant.grantedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {grant.revokedAt ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(grant.revokedAt).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {grant.status === 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeAccess(grant.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}