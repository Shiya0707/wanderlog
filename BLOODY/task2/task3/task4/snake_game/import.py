
import pygame
import random
import sys

# Initialize pygame
pygame.init()

# Screen settings
WIDTH = 600
HEIGHT = 400
BLOCK = 20

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Snake Game - Systemtron Task")

clock = pygame.time.Clock()

# Colors
BLACK = (0, 0, 0)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
WHITE = (255, 255, 255)
YELLOW = (255, 255, 0)

font = pygame.font.SysFont("Arial", 25)
big_font = pygame.font.SysFont("Arial", 40)

def draw_text(text, color, x, y, font_type=font):
    img = font_type.render(text, True, color)
    screen.blit(img, (x, y))

def random_food():
    x = random.randrange(0, WIDTH, BLOCK)
    y = random.randrange(0, HEIGHT, BLOCK)
    return [x, y]

def game():
    snake = [[100, 100]]
    direction = "RIGHT"

    food = random_food()

    score = 0

    while True:
        clock.tick(10)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP and direction != "DOWN":
                    direction = "UP"
                elif event.key == pygame.K_DOWN and direction != "UP":
                    direction = "DOWN"
                elif event.key == pygame.K_LEFT and direction != "RIGHT":
                    direction = "LEFT"
                elif event.key == pygame.K_RIGHT and direction != "LEFT":
                    direction = "RIGHT"

        head = snake[0][:]

        if direction == "UP":
            head[1] -= BLOCK
        elif direction == "DOWN":
            head[1] += BLOCK
        elif direction == "LEFT":
            head[0] -= BLOCK
        elif direction == "RIGHT":
            head[0] += BLOCK

        # Collision with wall
        if head[0] < 0 or head[0] >= WIDTH or head[1] < 0 or head[1] >= HEIGHT:
            break

        # Collision with self
        if head in snake:
            break

        snake.insert(0, head)

        if head == food:
            score += 1
            food = random_food()
        else:
            snake.pop()

        # Draw everything
        screen.fill(BLACK)

        pygame.draw.rect(screen, RED, (food[0], food[1], BLOCK, BLOCK))

        for part in snake:
            pygame.draw.rect(screen, GREEN, (part[0], part[1], BLOCK, BLOCK))

        draw_text(f"Score : {score}", WHITE, 10, 10)

        pygame.display.update()

    return score

def game_over(score):
    while True:
        screen.fill(BLACK)

        draw_text("GAME OVER", RED, 180, 100, big_font)
        draw_text(f"Final Score : {score}", YELLOW, 200, 170)
        draw_text("Press R to Restart", WHITE, 170, 240)
        draw_text("Press Q to Quit", WHITE, 190, 280)

        pygame.display.update()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_r:
                    return
                if event.key == pygame.K_q:
                    pygame.quit()
                    sys.exit()

while True:
    final_score = game()
    game_over(final_score)