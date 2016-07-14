# Biblioteca
DAO de una biblioteca distribuida

### Funcionalidades
- Lista de miembros por invitación
- Añadir nuevos libros al DAO
- Libros identificados por IBSN (se pueden tener varias copias de un mismo libro)
- Prestamo de libros entre miembros del DAO

### Propuestas
- Limitar el número de libros que una persona puede tener en préstamo.
- Limitar la duración de los préstamos.
- Permitir que el dueño original de un libro retire de forma indefinida su libro del DAO.
- Guardar un registro de usuarios por los que ha pasado un libro.
- Permitir que quienes han leído un libro (por ISBN) escriban opiniones sobre él (las opiniones se guardarían como ficheros de texto en IPFS y se referenciarían desde el DAO).
- Permitir que el dueño original de un libro fije un precio a partir del cual otro usuario pueda retirar el libro (precio fijado en ETH o EUR + Oracle).
- Sistema de votación entre los miembros del DAO para decidir:
    -  Nuevos miebros del DAO (en lugar de por invitación)
    -  El valor de algunas de las variables de las anteriores propuestas.
    -  Comprar libros cuyo propietario sería el propio DAO
- Interfaz gráfica para MIST
