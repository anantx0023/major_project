import gymnasium as gym
from gymnasium import spaces
import numpy as np
import traci
import os

SUMO_BINARY = "sumo"
SUMO_CONFIG = "Sumo_config/traffic.sumocfg.xml"

class TrafficEnv(gym.Env):

    def __init__(self):

        super(TrafficEnv, self).__init__()

        # state: vehicle count in 4 directions
        self.observation_space = spaces.Box(
            low=0,
            high=200,
            shape=(4,),
            dtype=np.float32
        )

        # action: 0 = NS green (phase 0), 1 = EW green (phase 2)
        self.action_space = spaces.Discrete(2)

        self.step_count = 0
        self.max_steps = 500

    def start_sumo(self):

        traci.start([
            SUMO_BINARY,
            "-c",
            SUMO_CONFIG,
            "--start",
            "--no-step-log"
        ])

    def reset(self, seed=None):

        if traci.isLoaded():
            traci.close()

        self.start_sumo()

        self.step_count = 0

        state = self.get_state()

        return state, {}

    def get_state(self):

        north = traci.lane.getLastStepVehicleNumber("north_in_0")
        south = traci.lane.getLastStepVehicleNumber("south_in_0")
        east = traci.lane.getLastStepVehicleNumber("east_in_0")
        west = traci.lane.getLastStepVehicleNumber("west_in_0")

        state = np.array([north, south, east, west], dtype=np.float32)

        return state

    def apply_action(self, action):

        tls_id = "center"

        # 0 → phase 0 (NS green), 1 → phase 2 (EW green)
        phase = 0 if action == 0 else 2

        traci.trafficlight.setPhase(tls_id, phase)

    def step(self, action):

        self.apply_action(action)

        traci.simulationStep()

        state = self.get_state()

        waiting_time = (
            traci.lane.getWaitingTime("north_in_0") +
            traci.lane.getWaitingTime("south_in_0") +
            traci.lane.getWaitingTime("east_in_0") +
            traci.lane.getWaitingTime("west_in_0")
        )

        reward = -waiting_time

        self.step_count += 1

        done = self.step_count >= self.max_steps

        return state, reward, done, False, {}

    def close(self):

        if traci.isLoaded():
            traci.close()