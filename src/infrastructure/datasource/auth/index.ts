import { bcryptAdapter, JwtAdapter } from '@/config/adapters'
import { UserModel } from '@/data/mongo/models/user'
import { type AuthDataSource } from '@/domain/datasources'
import { type LoginDto, type RegisterDto } from '@/domain/dto'
import { UserEntity, type UserEntityData } from '@/domain/entities/user'
import { CustomError } from '@/domain/errors'
import { USER_ROLE } from '@/domain/types/enum'

export class AuthDataSourceImpl implements AuthDataSource {
    async login(loginDto: LoginDto): Promise<{
        token: string
        user: UserEntityData
    }> {
        const user = await UserModel.findOne({ email: loginDto.getEmail })

        if (!user) throw CustomError.notFound('Usuario o contraseña incorrectos')
        const isMatchingPassword = bcryptAdapter.compare(loginDto.getPassword, user.password)

        if (!isMatchingPassword) throw CustomError.notFound('Usuario o contraseña incorrectos')

        const { getData } = UserEntity.fromObject(user)

        const token = await JwtAdapter.generateToken({ id: user.id, email: user.email })
        if (!token) throw CustomError.internalServer('Error al crear el token')

        return {
            token: token as string,
            user: getData,
        }
    }

    async recovery(email: string): Promise<void> {}

    async register(registerDto: RegisterDto): Promise<void> {
        const { firstName, lastName, email, password, address } = registerDto.getData

        const user = new UserModel({
            firstName,
            lastName,
            email,
            password: bcryptAdapter.hash(password),
            role: USER_ROLE.USER,
            address,
        })

        await user.save()
    }
}
