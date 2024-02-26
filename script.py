# import subprocess

# installed_packages = subprocess.check_output(['pip', 'freeze']).decode().split('\n')

# for package in installed_packages:
#     if package.strip():
#         subprocess.run(['pip', 'uninstall', '-y', package.split('==')[0]])

import os
from dotenv import load_dotenv
load_dotenv()

print(os.environ.get("APP_Name"))