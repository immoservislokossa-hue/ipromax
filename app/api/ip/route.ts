// app/api/ip/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // 🔍 Extraction IP fiable (ordre de priorité)
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-real-ip') ||
      'unknown'

    // 🧪 Vérifie format IPv4 / IPv6
    const ipRegex =
      /^(?:\d{1,3}\.){3}\d{1,3}$|^(?:[a-fA-F0-9]{1,4}:){1,7}[a-fA-F0-9]{1,4}$/
    const safeIp = ipRegex.test(ip) ? ip : 'unknown'

    // 🚨 Log si l’IP semble anormale
    if (safeIp === 'unknown') {
      console.warn('🚨 IP non détectée ou suspecte:', ip)
    }

    return NextResponse.json({
      ip: safeIp,
      timestamp: new Date().toISOString(),
      message:
        safeIp !== 'unknown'
          ? 'IP détectée avec succès'
          : 'Impossible de déterminer votre IP',
    })
  } catch (error) {
    console.error('Erreur lors de la récupération IP:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
