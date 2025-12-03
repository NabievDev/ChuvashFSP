from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
import asyncio

from app.database import init_db, SessionLocal
from app.routes import auth, news, events, documents, team, leadership, contact
from app.seed_data import seed_initial_data
from app.config import get_settings
from app.services.telegram_parser import sync_telegram_news

settings = get_settings()

async def sync_telegram_task():
    while True:
        try:
            db = SessionLocal()
            await sync_telegram_news(db)
            db.close()
            print("Telegram news synchronized")
        except Exception as e:
            print(f"Error syncing telegram: {e}")
        await asyncio.sleep(3600)

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    db = SessionLocal()
    try:
        seed_initial_data(db)
        await sync_telegram_news(db)
    except Exception as e:
        print(f"Startup error: {e}")
    finally:
        db.close()
    
    task = asyncio.create_task(sync_telegram_task())
    yield
    task.cancel()

app = FastAPI(
    title="FSP Chuvashia API",
    description="API для сайта Федерации спортивного программирования по Чувашской Республике",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(news.router, prefix="/api")
app.include_router(events.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(team.router, prefix="/api")
app.include_router(leadership.router, prefix="/api")
app.include_router(contact.router, prefix="/api")

os.makedirs(settings.upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "FSP Chuvashia API is running"}

@app.get("/api/info")
async def get_federation_info():
    return {
        "full_name": "Региональная физкультурно-спортивная общественная организация «Федерация спортивного программирования по Чувашской Республике»",
        "short_name": "РФСОО «ФСП по Чувашской Республике»",
        "informal_names": [
            "Федерация спортивного программирования по Чувашской Республике",
            "ФСП по Чувашской Республике",
            "ФСП Чувашии"
        ],
        "description": "Спортивное программирование – это инновационный вид спорта, где участникам необходимо реализовать качественную программу или алгоритм в условиях ограниченного времени.",
        "disciplines": [
            {
                "name": "Программирование алгоритмическое",
                "description": "Решение группы задач путем написания наиболее оптимальных программных алгоритмов в условиях ограниченного времени.",
                "icon": "algorithm"
            },
            {
                "name": "Программирование продуктовое (хакатон)",
                "description": "Создание программных продуктов (приложений, сайтов, сервисов), отвечающих заданным требованиям и выполняющих определенные прикладные задачи.",
                "icon": "product"
            },
            {
                "name": "Программирование систем информационной безопасности",
                "description": "Комплекс соревнований в области кибербезопасности, включающий в себя поиск и устранение системных уязвимостей, отработку кибератак и защиты от них.",
                "icon": "security"
            },
            {
                "name": "Программирование робототехники",
                "description": "Написание кода и поведенческих алгоритмов для автономных роботов, соревнующихся по определенным правилам.",
                "icon": "robotics"
            },
            {
                "name": "Программирование БАС",
                "description": "Написание кода для автономного полета дрона или роя дронов, а также выполнения им поставленных задач в условиях соревновательного полигона.",
                "icon": "drone"
            }
        ],
        "history": [
            {
                "date": "19 октября 2021",
                "event": "Дата основания Федерации спортивного программирования России"
            },
            {
                "date": "12 апреля 2022",
                "event": "Спортивное программирование было официально признано видом спорта"
            },
            {
                "date": "28 декабря 2022",
                "event": "Создано Региональное отделение ФСП России в Чувашии"
            },
            {
                "date": "03 июля 2025",
                "event": "ФСП Чувашии получило статус юридического лица"
            }
        ],
        "contacts": {
            "telegram": "https://t.me/fspchuv",
            "email": "chuvashia@fsp-russia.ru"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
