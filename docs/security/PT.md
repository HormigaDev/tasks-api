# 🛡️ Política de Segurança

## 🚧 Versões Suportadas

| Versão | Suportada |
| ------ | --------- |
| latest | ✅        |

Este projeto é mantido ativamente, incluindo atualizações de segurança quando necessário.

---

## 🔐 Considerações de Segurança

Este projeto foi desenvolvido aplicando medidas razoáveis para mitigar riscos comuns de segurança em aplicações web modernas:

- **Autenticação:** Baseada em JWT utilizando Passport Strategy. Todos os endpoints requerem autenticação.
- **Autorização:** Controle de acesso garantindo que os dados sejam acessíveis apenas pelos seus respectivos proprietários.
- **Armazenamento Seguro:** Uso de PostgreSQL com restrições relacionais adequadas para proteger a integridade dos dados.
- **Gestão de Sessões:** Arquitetura stateless utilizando JWT.
- **Cache:** Redis utilizado com gerenciamento controlado de chaves, minimizando exposição desnecessária de dados.
- **Ambiente de Execução:** Contêineres Docker configurados para evitar execução de processos como root.
- **Validação de Dados:** Validação rigorosa nos DTOs utilizando `class-validator` no NestJS.
- **Tratamento de Erros:** Respostas controladas, evitando exposição de detalhes internos do sistema.
- **Configuração Segura:** Políticas de CORS restritivas por padrão e gerenciamento seguro das variáveis de ambiente.

---

## 📣 Relato de Vulnerabilidades

Se você identificar uma possível vulnerabilidade de segurança, pedimos que a reporte de forma responsável.

- **Email:** hormigadev7@gmail.com
- **Atenção:** Não abra issues públicas no GitHub para questões relacionadas à segurança.

**Prazo estimado de resposta:** até **72 horas**.

---

## 📜 Política de Divulgação

- Os relatos serão avaliados e, se confirmados, tratados de forma privada.
- A divulgação pública ocorrerá **somente após a disponibilização de um patch**.
- O devido crédito será dado a quem reportar, a menos que seja solicitado anonimato.

---

## 🔍 Vulnerabilidades Fora de Escopo

- Problemas causados por configurações inseguras feitas pelo usuário (ex.: executar sem `.env`, expor portas internas como Redis ou PostgreSQL, desabilitar autenticação, etc.).
- Vulnerabilidades em dependências de terceiros que já possuam correções disponíveis.

---

## 🚀 Boas Práticas para Deploy Seguro

- Certifique-se de que todas as variáveis de ambiente estejam corretamente configuradas (`JWT_SECRET`, `DATABASE_URL`, etc.).
- Nunca exponha portas sensíveis (Redis, PostgreSQL) diretamente na internet. Utilize redes internas do Docker ou VPNs.
- Utilize HTTPS em ambientes de produção.
- Realize rotação periódica de segredos e credenciais.
- Utilize imagens de contêiner confiáveis e realize varreduras de segurança (como Trivy ou Docker Scout).

---

## 🔥 Por Que Isso É Importante

Este documento reflete o compromisso deste projeto com a adoção de medidas que ajudam a mitigar riscos comuns de segurança. Embora nenhum sistema seja totalmente imune, foram tomadas decisões conscientes para oferecer um nível de proteção alinhado aos padrões modernos de desenvolvimento de software.

---
