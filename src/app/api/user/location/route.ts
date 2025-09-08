import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'
import LocationService from '@/lib/services/location'
import { z } from 'zod'

const updateLocationSchema = z.object({
  coordinates: z.object({
    lat: z.number().min(6.0).max(37.6, 'Location must be within India'),
    lng: z.number().min(68.0).max(97.25, 'Location must be within India'),
    accuracy: z.number().optional()
  }),
  address: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid Indian pincode').optional(),
  method: z.enum(['gps', 'manual', 'auto']).default('gps')
})

// GET - Get user location and history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const user = await User.findById(session.user.id)
      .select('location locationHistory approximateLocation serviceRadius')

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        currentLocation: user.location,
        locationHistory: user.locationHistory || [],
        approximateLocation: user.approximateLocation,
        serviceRadius: user.serviceRadius,
        formattedLocation: LocationService.formatLocation(user.location)
      }
    })

  } catch (error) {
    console.error('Get location error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update user location
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate request body
    const validationResult = updateLocationSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid location data',
          details: validationResult.error.format()
        },
        { status: 400 }
      )
    }

    const { coordinates, address, city, state, pincode, method } = validationResult.data

    // Additional India bounds validation
    if (!LocationService.isWithinIndiaBounds(coordinates.lat, coordinates.lng)) {
      return NextResponse.json(
        { 
          error: 'Location must be within India',
          message: 'Please ensure your location is within Indian geographical boundaries'
        },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Use the updateLocation method we added to the schema
    user.updateLocation({
      coordinates,
      address,
      city,
      state,
      method
    })

    // Update additional fields
    if (pincode) {
      user.location.pincode = pincode
    }

    user.location.stateCode = LocationService.getStateCode(state)
    user.location.verified = method === 'gps' // GPS locations are considered more verified

    await user.save()

    return NextResponse.json({
      success: true,
      message: 'Location updated successfully',
      data: {
        currentLocation: user.location,
        approximateLocation: user.approximateLocation,
        locationHistory: user.locationHistory.slice(0, 3), // Return only last 3
        formattedLocation: LocationService.formatLocation(user.location)
      }
    })

  } catch (error) {
    console.error('Update location error:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid location data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Get current GPS location
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { coordinates } = body

    if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
      return NextResponse.json(
        { error: 'Valid coordinates are required' },
        { status: 400 }
      )
    }

    // Validate coordinates are within India
    if (!LocationService.isWithinIndiaBounds(coordinates.lat, coordinates.lng)) {
      return NextResponse.json(
        { 
          error: 'Location must be within India',
          message: 'Your location appears to be outside India. Please ensure you are located within Indian geographical boundaries.'
        },
        { status: 400 }
      )
    }

    // Reverse geocode to get address details
    const geocodeResult = await LocationService.reverseGeocode(coordinates.lat, coordinates.lng)
    
    if (geocodeResult.error) {
      return NextResponse.json(
        { error: geocodeResult.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        coordinates: {
          lat: Number(coordinates.lat.toFixed(6)),
          lng: Number(coordinates.lng.toFixed(6)),
          accuracy: coordinates.accuracy || 0
        },
        address: geocodeResult.address,
        city: geocodeResult.city,
        state: geocodeResult.state,
        stateCode: geocodeResult.stateCode,
        pincode: geocodeResult.pincode,
        region: LocationService.getRegionFromState(geocodeResult.state || ''),
        isWithinIndia: true
      }
    })

  } catch (error) {
    console.error('GPS location error:', error)
    return NextResponse.json(
      { error: 'Failed to process location' },
      { status: 500 }
    )
  }
}