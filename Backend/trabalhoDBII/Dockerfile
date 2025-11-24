FROM maven:3.9.5-eclipse-temurin-21 AS builder
# Define o diretório de trabalho dentro da imagem
WORKDIR /app
# Copia o arquivo de configuração do Maven (pom.xml)
COPY pom.xml .
# Copia todo o código-fonte
COPY src ./src
# Comando para compilar o projeto e gerar o JAR final
RUN mvn clean package -DskipTests

# --------------------------------------------------------------------------

# ESTÁGIO 2: RUN (Execução da Aplicação)
# Use a tag corrigida (por exemplo, 21-jre-alpine, conforme sugestão anterior)
FROM eclipse-temurin:21-jre-alpine
# Define o diretório de trabalho
WORKDIR /app
EXPOSE 8080
# Copia o JAR compilado do estágio "builder"
COPY --from=builder /app/target/trabalhoDBII-0.0.1-SNAPSHOT.jar app.jar
# Comando de inicialização
ENTRYPOINT ["java", "-jar", "app.jar"]