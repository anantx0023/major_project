from stable_baselines3 import PPO
from traffic_env import TrafficEnv

def main():

    print("Starting training...")

    env = TrafficEnv()

    model = PPO(
        "MlpPolicy",
        env,
        verbose=1,
        learning_rate=0.0003,
        n_steps=256,
        batch_size=64
    )

    model.learn(
        total_timesteps=100000
    )

    model.save("traffic_model")

    env.close()

    print("Training complete. Model saved.")

if __name__ == "__main__":
    main()