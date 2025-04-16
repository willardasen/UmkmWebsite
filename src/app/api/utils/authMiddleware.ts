import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import jwt from 'jsonwebtoken'

export function requireRole(roles: string[], handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) return res.status(401).json({ message: 'Unauthorized' })

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient role' })
      }

      req.body.user = decoded
      return handler(req, res)
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
  }
}