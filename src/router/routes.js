const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'loginDefault', component: () => import('pages/loginPage.vue') },
      { path: 'login', name: 'loginPage', component: () => import('pages/loginPage.vue') },
      { path: 'setup', name: 'setupPage', component: () => import('pages/setupPage.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'me', name: 'me', component: () => import('pages/IndexPage.vue') },
      { path: 'turmas', name: 'turmasPage', component: () => import('pages/turma/turmas.vue') },
      { path: 'alunos', name: 'alunosPage', component: () => import('pages/aluno/alunosPage.vue') },
      { path: 'alunos/create', name: 'createAluno', component: () => import('pages/aluno/createAluno.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/turma/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'id/:Id', name: 'turmaPage', component: () => import('pages/turma/turma.vue') },
      { path: 'create', name: 'createTurma', component: () => import('pages/turma/createTurma.vue') }
      // { path: 'frequencia', name: 'turmaFrequencia', component: () => import('pages/turma/turmaFrequencia.vue') }
    ],
    props: true,
    meta: {
      requiresAuth: true
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
