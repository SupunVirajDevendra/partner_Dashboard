// API service for Partner Integration Service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// Auth interfaces
interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

// Merchant interfaces
interface Merchant {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  updatedAt: string
}

interface CreateMerchantRequest {
  name: string
  email: string
  phone?: string
  address?: string
}

// POS Company interfaces
interface POSCompany {
  id: string
  name: string
  description?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

interface CreatePOSCompanyRequest {
  name: string
  description?: string
}

// Customer Merchant Access interfaces
interface AccessGrant {
  id: string
  customerId: string
  merchantId: string
  status: 'active' | 'revoked'
  grantedAt: string
  revokedAt?: string
}

interface GrantAccessRequest {
  customerId: string
  merchantId: string
}

// Dashboard statistics
interface DashboardStats {
  totalMerchants: number
  activeMerchants: number
  posCompanies: number
  activeAccessGrants: number
  merchantGrowth: Array<{
    month: string
    merchants: number
  }>
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    localStorage.setItem('authToken', data.token)
    return data
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken')
  }

  // Merchant endpoints
  async getMerchants(): Promise<Merchant[]> {
    const response = await fetch(`${API_BASE_URL}/merchants`, {
      headers: this.getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch merchants')
    }

    const data: ApiResponse<Merchant[]> = await response.json()
    return data.data
  }

  async getMerchantById(id: string): Promise<Merchant> {
    const response = await fetch(`${API_BASE_URL}/merchants/${id}`, {
      headers: this.getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch merchant')
    }

    const data: ApiResponse<Merchant> = await response.json()
    return data.data
  }

  async createMerchant(merchant: CreateMerchantRequest): Promise<Merchant> {
    const response = await fetch(`${API_BASE_URL}/merchants`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(merchant)
    })

    if (!response.ok) {
      throw new Error('Failed to create merchant')
    }

    const data: ApiResponse<Merchant> = await response.json()
    return data.data
  }

  async updateMerchant(id: string, updates: Partial<CreateMerchantRequest>): Promise<Merchant> {
    const response = await fetch(`${API_BASE_URL}/merchants/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      throw new Error('Failed to update merchant')
    }

    const data: ApiResponse<Merchant> = await response.json()
    return data.data
  }

  async deactivateMerchant(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/merchants/${id}/deactivate`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to deactivate merchant')
    }
  }

  async deleteMerchant(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/merchants/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to delete merchant')
    }
  }

  // POS Company endpoints
  async getPOSCompanies(): Promise<POSCompany[]> {
    const response = await fetch(`${API_BASE_URL}/pos-companies`, {
      headers: this.getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch POS companies')
    }

    const data: ApiResponse<POSCompany[]> = await response.json()
    return data.data
  }

  async getPOSCompanyById(id: string): Promise<POSCompany> {
    const response = await fetch(`${API_BASE_URL}/pos-companies/${id}`, {
      headers: this.getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch POS company')
    }

    const data: ApiResponse<POSCompany> = await response.json()
    return data.data
  }

  async createPOSCompany(posCompany: CreatePOSCompanyRequest): Promise<POSCompany> {
    const response = await fetch(`${API_BASE_URL}/pos-companies`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(posCompany)
    })

    if (!response.ok) {
      throw new Error('Failed to create POS company')
    }

    const data: ApiResponse<POSCompany> = await response.json()
    return data.data
  }

  async updatePOSCompany(id: string, updates: Partial<CreatePOSCompanyRequest>): Promise<POSCompany> {
    const response = await fetch(`${API_BASE_URL}/pos-companies/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      throw new Error('Failed to update POS company')
    }

    const data: ApiResponse<POSCompany> = await response.json()
    return data.data
  }

  async deactivatePOSCompany(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pos-companies/${id}/deactivate`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to deactivate POS company')
    }
  }

  // Customer Merchant Access endpoints
  async grantAccess(access: GrantAccessRequest): Promise<AccessGrant> {
    const response = await fetch(`${API_BASE_URL}/customer-merchant-access/grant`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(access)
    })

    if (!response.ok) {
      throw new Error('Failed to grant access')
    }

    const data: ApiResponse<AccessGrant> = await response.json()
    return data.data
  }

  async listAccessByUser(userId: string): Promise<AccessGrant[]> {
    const response = await fetch(`${API_BASE_URL}/customer-merchant-access/user/${userId}`, {
      headers: this.getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user access')
    }

    const data: ApiResponse<AccessGrant[]> = await response.json()
    return data.data
  }

  async checkAccess(customerId: string, merchantId: string): Promise<AccessGrant | null> {
    const response = await fetch(`${API_BASE_URL}/customer-merchant-access/check`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ customerId, merchantId })
    })

    if (!response.ok) {
      throw new Error('Failed to check access')
    }

    const data: ApiResponse<AccessGrant | null> = await response.json()
    return data.data
  }

  async revokeAccess(accessId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/customer-merchant-access/${accessId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to revoke access')
    }
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: this.getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats')
    }

    const data: ApiResponse<DashboardStats> = await response.json()
    return data.data
  }
}

export const apiService = new ApiService()
export type {
  Merchant,
  POSCompany,
  AccessGrant,
  DashboardStats,
  CreateMerchantRequest,
  CreatePOSCompanyRequest,
  GrantAccessRequest
}
