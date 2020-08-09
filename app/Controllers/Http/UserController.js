'use strict'
const User = use('App/Models/User')
const { validateAll } = use('Validator')

class UserController {
    async create({ request, response }){
        try {

            const erroMessage = {
                'usesrname.required':'Preencha o nome de usuário!',
                'username.unique':'Esse Nome de usuário Já existe!',
                'username.min':'Esse campo deve ter ao menos 6 caracteres!',
                'email.required': 'Preencha o campo email',
                'email.email':'Informe um email válido',
                'email.unique':'Esse email já está cadastrado',
                'password.required':'O campo senha é obrigatório',
                'password.min':'A senha precisa ter pelo menos 6 caracteres'
            }
            const validation = await validateAll(request.all(), {
                username: 'required|min:6|unique:users',
                email: 'required|email|unique:users',
                password: 'required|min:6'
            }, erroMessage)

            if(validation.fails()){
                return response.status(401).send({message: validation.messages()})
            }
            const data = request.only(["username","email","password"])
            const user = await User.create(data)
            return user
        } catch (error) {
            return response.status(500).send({error: `Erro: ${error.message}`})
        }
        
    }

    async login({request, response, auth}){
        try {
            const {email, password} = request.all()
            const validaToken = await auth.attempt(email, password)
            return validaToken
        } catch (error) {
            return response.status(500).send({error: `Erro: ${error.message}`})
            
        }
    }
}

module.exports = UserController
