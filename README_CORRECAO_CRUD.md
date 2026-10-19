# Memory Cream Back-Office — correção inicial do CRUD

## O que foi ajustado

- As consultas agora usam as tabelas existentes no banco: `leads`, `payments`, `contracts` e `settings`.
- Removida a ordenação por `position`, coluna que não existe no esquema confirmado. As listas são ordenadas por `created_at`.
- Mapeamento de configurações ajustado do objeto JavaScript para as colunas da tabela `settings` (`company_name`, `bike_price`, etc.).
- O carregamento de tabelas vazias não cria automaticamente os registros de demonstração de `initialData.ts`.
- A gravação de listas faz `upsert` sem excluir registros ausentes na lista local. Isso evita exclusões acidentais quando há dados de outro dispositivo.
- Adicionadas funções explícitas `deleteLead`, `deletePayment` e `deleteContract` para exclusão por ID na camada de dados.
- Tipos do Supabase alinhados às tabelas reais (`payments`, `contracts`, `settings`).
- A migração local preexistente é mantida como caminho de recuperação quando ainda não foi marcada como concluída.

## Validação feita

- `tsc --noEmit`: concluído sem erros.
- O build Vite não pôde ser validado neste ambiente porque o `node_modules` enviado contém bindings nativos do Windows e não possui o binding Linux. Em uma máquina Windows, execute `npm install` (ou o gerenciador de pacotes usado no projeto) e depois `npm run build`.
- Não foi realizada gravação real no Supabase a partir deste ambiente; é necessário testar no projeto conectado usando dados de teste.

## Atenção: segurança

Este projeto **não está pronto para produção**. As políticas RLS atuais permitem SELECT/INSERT/UPDATE/DELETE para `anon` e `authenticated` nas tabelas financeiras e de contratos. Isso deixa dados acessíveis e modificáveis por clientes sem autenticação administrativa adequada.

A correção do CRUD não modifica essas políticas para evitar bloquear o painel sem que exista um login administrativo configurado. Antes de produção, implemente Supabase Auth e políticas RLS que autorizem operações administrativas somente aos usuários autorizados. Não coloque `service_role` ou `sb_secret_` no frontend.

## Como validar no Windows

1. Faça backup dos dados atuais do Supabase antes de qualquer mudança adicional.
2. Extraia o ZIP para uma pasta nova; não substitua ainda a cópia original.
3. Configure as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no `.env.local` local (não compartilhe esse arquivo).
4. Execute `npm install`.
5. Execute `npm run lint` e `npm run build`.
6. Teste leitura, inclusão e edição de um registro de teste em cada módulo. Confirme no Table Editor do Supabase que os dados foram persistidos.
7. Não teste exclusões em dados reais. As funções de exclusão por ID existem na camada de dados, mas os componentes atuais ainda não expõem botões de exclusão na interface.

## Limitações conhecidas

- Os handlers de tela ainda atualizam o estado React antes da confirmação da gravação feita pelos efeitos do `App.tsx`; as mensagens de sucesso devem ser refinadas para só confirmar após a resposta do banco.
- O salvamento de listas pode atualizar registros antigos a partir de um estado desatualizado em caso de edição concorrente. A evolução recomendada é migrar cada handler para operações individuais (`insert`/`upsert` por registro) e exibir estado de salvamento/erro por operação.
- A coluna `updated_at` depende do comportamento atual do banco; recomenda-se um trigger para atualizá-la automaticamente.
