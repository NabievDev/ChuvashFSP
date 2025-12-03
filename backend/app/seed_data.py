from sqlalchemy.orm import Session
from .models.models import LeadershipMember, TeamMember, DocumentCategory
from datetime import datetime

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
        categories_data = [
            DocumentCategory(
                name="Учредительные документы",
                order=1
            ),
            DocumentCategory(
                name="Нормативные документы",
                order=2
            ),
        ]
        db.add_all(categories_data)
    
    db.commit()
