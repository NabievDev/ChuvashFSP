from sqlalchemy.orm import Session
from .models.models import LeadershipMember, TeamMember, DocumentCategory, Document, Event
from datetime import datetime, date

def seed_initial_data(db: Session):
    if db.query(LeadershipMember).count() == 0:
        leadership_data = [
            LeadershipMember(
                full_name="Общее собрание членов",
                position="Высший орган управления",
                description="Высший орган управления РФСОО «ФСП по Чувашской Республике»",
                order=1
            ),
            LeadershipMember(
                full_name="Набиев Александр Эльдарович",
                position="Президент РФСОО «ФСП по Чувашской Республике»",
                description="Руководит деятельностью Федерации спортивного программирования по Чувашской Республике",
                order=2
            ),
            LeadershipMember(
                full_name="Спиридонов Михаил Юрьевич",
                position="Первый Вице-президент",
                description="Заместитель президента федерации",
                order=3
            ),
            LeadershipMember(
                full_name="Иванова Анна Алексеевна",
                position="Член Федерации и Правления",
                order=4
            ),
            LeadershipMember(
                full_name="Константинов Михаил Романович",
                position="Член Федерации и Правления",
                order=5
            ),
            LeadershipMember(
                full_name="Алексеев Юрий Витальевич",
                position="Член Федерации и Правления",
                order=6
            ),
        ]
        db.add_all(leadership_data)
    
    if db.query(TeamMember).count() == 0:
        team_data = [
            TeamMember(
                full_name="Иванов Константин Владиславович",
                city="Новочебоксарск",
                category="Основной состав",
                discipline="Продуктовое программирование",
                position="Юниор",
                order=1
            ),
            TeamMember(
                full_name="Антонов Юрий Владимирович",
                city="Чебоксары",
                category="Основной состав",
                discipline="Продуктовое программирование",
                position="Юниор",
                order=2
            ),
            TeamMember(
                full_name="Христофоров Иван Александрович",
                city="Чебоксары",
                category="Основной состав",
                discipline="Продуктовое программирование",
                position="Юниор",
                order=3
            ),
            TeamMember(
                full_name="Фадеев Тимур Александрович",
                city="Чебоксары",
                category="Основной состав",
                discipline="Продуктовое программирование",
                position="Юниор",
                order=4
            ),
            TeamMember(
                full_name="Лапин Аллен Джеймсович",
                city="Новочебоксарск",
                category="Основной состав",
                discipline="Продуктовое программирование",
                position="Юниор",
                order=5
            ),
        ]
        db.add_all(team_data)
    
    if db.query(DocumentCategory).count() == 0:
        cat1 = DocumentCategory(
            name="Учредительные документы",
            order=1
        )
        cat2 = DocumentCategory(
            name="Нормативные документы",
            order=2
        )
        db.add_all([cat1, cat2])
        db.flush()
        
        docs = [
            Document(
                title="Устав РФСОО «ФСП по Чувашской Республике»",
                filename="ustav_fsp_chuvashia.pdf",
                file_path="uploads/documents/ustav_fsp_chuvashia.pdf",
                file_size=1024000,
                category_id=cat1.id,
                order=1
            ),
            Document(
                title="Свидетельство о регистрации",
                filename="svidetelstvo_registracii.pdf",
                file_path="uploads/documents/svidetelstvo_registracii.pdf",
                file_size=512000,
                category_id=cat1.id,
                order=2
            ),
            Document(
                title="Положение о членстве",
                filename="polozhenie_o_chlenstve.pdf",
                file_path="uploads/documents/polozhenie_o_chlenstve.pdf",
                file_size=768000,
                category_id=cat2.id,
                order=1
            ),
            Document(
                title="Регламент проведения соревнований",
                filename="reglament_sorevnovaniy.pdf",
                file_path="uploads/documents/reglament_sorevnovaniy.pdf",
                file_size=1536000,
                category_id=cat2.id,
                order=2
            ),
            Document(
                title="Положение о сборной команде",
                filename="polozhenie_sbornaya.pdf",
                file_path="uploads/documents/polozhenie_sbornaya.pdf",
                file_size=640000,
                category_id=cat2.id,
                order=3
            ),
        ]
        db.add_all(docs)
    
    if db.query(Event).count() == 0:
        events_data = [
            Event(
                title="Региональный этап Всероссийской олимпиады по спортивному программированию",
                description="Отборочный этап для определения участников финала Всероссийской олимпиады. Дисциплина: алгоритмическое программирование.",
                event_date=date(2025, 12, 7),
                event_time="10:00",
                location="ЧГУ им. И.Н. Ульянова, г. Чебоксары",
                event_type="Соревнование",
                is_visible=True
            ),
            Event(
                title="Хакатон «Цифровая Чувашия 2025»",
                description="48-часовой хакатон по разработке цифровых решений для региона. Призовой фонд 500 000 рублей.",
                event_date=date(2025, 12, 14),
                event_time="09:00",
                location="IT-парк «Цифровая Долина», г. Чебоксары",
                event_type="Хакатон",
                is_visible=True
            ),
            Event(
                title="Мастер-класс по подготовке к соревнованиям",
                description="Занятие для юных программистов по алгоритмам и структурам данных. Ведущий - призёр ICPC.",
                event_date=date(2025, 12, 15),
                event_time="14:00",
                location="Онлайн (Zoom)",
                event_type="Мастер-класс",
                is_visible=True
            ),
            Event(
                title="Чемпионат Чувашии по продуктовому программированию",
                description="Командное соревнование по созданию IT-продуктов. Победители представят регион на всероссийских соревнованиях.",
                event_date=date(2025, 12, 21),
                event_time="10:00",
                location="Технопарк «Инноград», г. Чебоксары",
                event_type="Чемпионат",
                is_visible=True
            ),
            Event(
                title="Новогодний контест для начинающих",
                description="Праздничное соревнование для начинающих программистов. Простые задачи, призы и подарки!",
                event_date=date(2025, 12, 28),
                event_time="12:00",
                location="Онлайн",
                event_type="Контест",
                is_visible=True
            ),
        ]
        db.add_all(events_data)
    
    db.commit()
