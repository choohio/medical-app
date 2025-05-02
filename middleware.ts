import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    verify(token, process.env.JWT_SECRET!) // Валидация токена
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Указываем, какие маршруты защищаем
export const config = {
  matcher: ['/profile'], // Пример защищённого маршрута
}
