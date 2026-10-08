# Meu PC Remoto

Painel pessoal para visualizar e controlar um computador Windows pelo celular. O painel web pode ser hospedado na Vercel; o agente fica somente no PC e escuta em `127.0.0.1`.

## Segurança

- O agente **não** abre porta pública no roteador.
- Use **Tailscale Serve** para criar HTTPS privado dentro da sua tailnet.
- Além da identidade Tailscale, o WebSocket exige um token aleatório local.
- O token fica em `agent/.remote-token` no PC e não deve ser enviado ao GitHub.
- O painel não grava endpoint/token em armazenamento persistente.

## 1. No PC

1. Instale Python 3.11+.
2. Instale e entre no Tailscale no PC.
3. Abra PowerShell nesta pasta e execute:
   `powershell -ExecutionPolicy Bypass -File .\agent\start-agent.ps1`
4. Em outro PowerShell **como Administrador**, execute:
   `tailscale serve --bg 8765`
5. O Tailscale mostrará um endereço parecido com `https://meu-pc.exemplo.ts.net`.

## 2. No iPhone

1. Instale o Tailscale e entre na mesma conta/tailnet do PC.
2. Abra o painel publicado na Vercel.
3. Cole o endereço HTTPS mostrado pelo Tailscale e o token mostrado pelo script.
4. Toque em **Conectar**.

## Controles

- Toque/arraste na tela remota para mouse.
- Campo de texto envia digitação ao PC.
- Atalhos para volume, mídia e bloqueio do Windows.

## Observações

Esta versão usa JPEG sobre WebSocket, adequada para administração pessoal e tarefas leves. Para jogos/vídeo em alta taxa de quadros, a evolução recomendada é WebRTC/H.264 ou integrar um engine dedicado de desktop remoto.

## Tailscale

A sintaxe atual do Serve é `tailscale serve [flags] <target>`; `--bg` mantém a configuração ativa em segundo plano. Consulte a documentação oficial do Tailscale para alterações futuras.
