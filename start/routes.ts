import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
  
  Route.get('/', async ()=>{
    return 'Hello'
  })
  Route.resource('livros',"LivrosController").apiOnly()
  Route.resource('users',"UsersController").apiOnly()
  Route.resource('emprestimos',"EmprestimosController").apiOnly()
  Route.get('lista',"EmprestimosController.listaEmprestimos")
  Route.get('populares','EmprestimosController.findPopulares')
  
}).prefix('/api')

Route.group(()=>{
  Route.get('genero','LivrosController.findByGenero')
  Route.get('titulo',"LivrosController.findByTitulo")
  Route.get('listaLivros',"LivrosController.listaLivros")
}).prefix('/api')
