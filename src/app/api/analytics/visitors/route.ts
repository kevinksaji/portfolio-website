import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // You'll need to get these from your Vercel dashboard
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN
    const PROJECT_ID = process.env.VERCEL_PROJECT_ID
    
    console.log('Environment variables check:')
    console.log('VERCEL_TOKEN:', VERCEL_TOKEN ? '✅ Set' : '❌ Missing')
    console.log('PROJECT_ID:', PROJECT_ID ? '✅ Set' : '❌ Missing')
    
    if (!VERCEL_TOKEN || !PROJECT_ID) {
      return NextResponse.json(
        { error: 'Vercel Analytics not configured. Check environment variables.' },
        { status: 500 }
      )
    }

    // Try multiple Vercel Analytics API endpoints to see what works
    console.log('\n🔍 Testing Vercel Analytics API endpoints...')
    
    const endpoints = [
      `https://vercel.com/api/v1/web/insights/stats?projectId=${PROJECT_ID}&from=2024-01-01&to=${new Date().toISOString().split('T')[0]}`,
      `https://vercel.com/api/v1/insights/stats?projectId=${PROJECT_ID}&from=2024-01-01&to=${new Date().toISOString().split('T')[0]}`,
      `https://vercel.com/api/web/insights/stats?projectId=${PROJECT_ID}&from=2024-01-01&to=${new Date().toISOString().split('T')[0]}`,
      `https://vercel.com/api/v1/projects/${PROJECT_ID}/analytics?from=2024-01-01&to=${new Date().toISOString().split('T')[0]}`
    ]
    
    let visitors = 0
    let successfulEndpoint = null
    
    for (const endpoint of endpoints) {
      try {
        console.log(`\n📡 Testing endpoint: ${endpoint}`)
        
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${VERCEL_TOKEN}`,
            'Content-Type': 'application/json',
          },
        })
        
        console.log(`Response status: ${response.status} ${response.statusText}`)
        console.log(`Response headers:`, Object.fromEntries(response.headers.entries()))
        
        if (response.ok) {
          const data = await response.json()
          console.log(`✅ SUCCESS! Response data:`, JSON.stringify(data, null, 2))
          
          // Try to extract visitor count
          if (data?.data?.pageViews) {
            visitors = data.data.pageViews
            console.log(`📊 Found pageViews in data.data.pageViews: ${visitors}`)
          } else if (data?.pageViews) {
            visitors = data.pageViews
            console.log(`📊 Found pageViews in data.pageViews: ${visitors}`)
          } else if (data?.data?.visitors) {
            visitors = data.data.visitors
            console.log(`📊 Found visitors in data.data.visitors: ${visitors}`)
          } else if (data?.visitors) {
            visitors = data.visitors
            console.log(`📊 Found visitors in data.visitors: ${visitors}`)
          } else {
            console.log(`⚠️ No visitor data found in response. Available keys:`, Object.keys(data))
            if (data.data) console.log(`Data keys:`, Object.keys(data.data))
          }
          
          successfulEndpoint = endpoint
          break
        } else {
          console.log(`❌ Failed with status ${response.status}`)
          if (response.status === 401) {
            console.log(`🔐 401 Unauthorized - Check your VERCEL_TOKEN`)
          } else if (response.status === 404) {
            console.log(`🔍 404 Not Found - Check your PROJECT_ID`)
          }
        }
      } catch (error) {
        console.log(`❌ Error testing endpoint:`, error)
      }
    }
    
    if (successfulEndpoint) {
      console.log(`\n🎯 Successfully used endpoint: ${successfulEndpoint}`)
    } else {
      console.log(`\n❌ All endpoints failed. Check your VERCEL_TOKEN and PROJECT_ID`)
      console.log(`Current values:`)
      console.log(`- VERCEL_TOKEN: ${VERCEL_TOKEN ? '✅ Set' : '❌ Missing'}`)
      console.log(`- PROJECT_ID: ${PROJECT_ID ? '✅ Set' : '❌ Missing'}`)
    }

    return NextResponse.json({ visitors })
  } catch (error) {
    console.error('Error fetching Vercel Analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
