import asyncio, io, json, os, secrets, subprocess, sys
from aiohttp import web
from PIL import Image
import mss
import pyautogui

HOST='127.0.0.1'
PORT=int(os.getenv('REMOTE_CONTROL_PORT','8765'))
TOKEN=os.getenv('REMOTE_CONTROL_TOKEN','').strip()
FPS=max(1,min(12,int(os.getenv('REMOTE_CONTROL_FPS','6'))))
JPEG_QUALITY=max(30,min(85,int(os.getenv('REMOTE_CONTROL_JPEG_QUALITY','60'))))
MAX_WIDTH=max(640,min(1920,int(os.getenv('REMOTE_CONTROL_MAX_WIDTH','1280'))))

if len(TOKEN) < 24:
    print('ERRO: defina REMOTE_CONTROL_TOKEN com pelo menos 24 caracteres.', file=sys.stderr)
    sys.exit(2)

pyautogui.PAUSE = 0.01
pyautogui.FAILSAFE = True

async def health(_):
    return web.json_response({'ok': True, 'service':'pc-remote-agent'})

def authorized(request):
    supplied=request.query.get('token','')
    return secrets.compare_digest(supplied,TOKEN)

def screen_size():
    w,h=pyautogui.size(); return int(w),int(h)

def to_xy(msg):
    w,h=screen_size(); x=float(msg.get('x',0)); y=float(msg.get('y',0))
    return max(0,min(w-1,int(x*w))), max(0,min(h-1,int(y*h)))

def action(name):
    if name=='volume_up': pyautogui.press('volumeup')
    elif name=='volume_down': pyautogui.press('volumedown')
    elif name=='play_pause': pyautogui.press('playpause')
    elif name=='lock' and sys.platform.startswith('win'):
        subprocess.Popen(['rundll32.exe','user32.dll,LockWorkStation'])

async def handle_input(msg):
    t=msg.get('type')
    if t=='move': pyautogui.moveTo(*to_xy(msg), duration=0)
    elif t=='mouse_down': pyautogui.moveTo(*to_xy(msg),duration=0); pyautogui.mouseDown(button=msg.get('button','left'))
    elif t=='mouse_up': pyautogui.moveTo(*to_xy(msg),duration=0); pyautogui.mouseUp(button=msg.get('button','left'))
    elif t=='click': pyautogui.click(*to_xy(msg),button=msg.get('button','left'))
    elif t=='text':
        text=str(msg.get('text',''))[:2000]
        if text: pyautogui.write(text, interval=0.002)
    elif t=='action': action(str(msg.get('action','')))

async def stream_frames(ws):
    delay=1/FPS
    with mss.mss() as sct:
        mon=sct.monitors[1]
        while not ws.closed:
            shot=sct.grab(mon)
            img=Image.frombytes('RGB',shot.size,shot.rgb)
            if img.width>MAX_WIDTH:
                nh=int(img.height*(MAX_WIDTH/img.width)); img=img.resize((MAX_WIDTH,nh),Image.Resampling.BILINEAR)
            buf=io.BytesIO(); img.save(buf,format='JPEG',quality=JPEG_QUALITY,optimize=False)
            await ws.send_bytes(buf.getvalue())
            await asyncio.sleep(delay)

async def websocket(request):
    if not authorized(request): return web.Response(status=401,text='Unauthorized')
    ws=web.WebSocketResponse(max_msg_size=64*1024, heartbeat=25)
    await ws.prepare(request)
    await ws.send_str(json.dumps({'type':'info','message':'Agente conectado com segurança.'}))
    sender=asyncio.create_task(stream_frames(ws))
    try:
        async for msg in ws:
            if msg.type==web.WSMsgType.TEXT:
                try: await handle_input(json.loads(msg.data))
                except Exception as exc: await ws.send_str(json.dumps({'type':'info','message':f'Comando ignorado: {type(exc).__name__}'}))
    finally:
        sender.cancel()
        try: await sender
        except asyncio.CancelledError: pass
    return ws

app=web.Application(client_max_size=128*1024)
app.router.add_get('/health',health)
app.router.add_get('/ws',websocket)

if __name__=='__main__':
    print(f'PC Remote Agent em http://{HOST}:{PORT}')
    web.run_app(app,host=HOST,port=PORT,access_log=None)
