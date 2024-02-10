import { envs } from '@/config'
import * as jwt from 'jsonwebtoken'

const JWT_SECRET = envs.JWT_SECRET

export class JwtAdapter {
    static async generateToken(payload: any, duration: string = '2h') {
        console.log(payload, duration, JWT_SECRET)
        return await new Promise((resolve) => {
            jwt.sign(payload, JWT_SECRET, { expiresIn: duration }, (err, token) => {
                if (err) {
                    resolve(null)
                    return
                }

                resolve(token)
            })
        })
    }

    static async validateToken<T>(token: string): Promise<T | null> {
        return await new Promise((resolve) => {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    resolve(null)
                    return
                }

                resolve(decoded as T)
            })
        })
    }
}
