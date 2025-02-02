from flask import Flask, request, render_template
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fetch_profile', methods=['POST'])
def fetch_profile():
    url = request.form['url']
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
    }

    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.text, 'lxml')

    title = soup.title.string if soup.title else "No title found"
    
    meta_description = soup.find('meta', attrs={'name': 'description'})
    description = meta_description['content'] if meta_description else "No description found"
    
    profile_name = soup.find('h1', class_='top-card-layout__title')
    profile_name_text = profile_name.get_text().strip() if profile_name else "No profile name found"
    
    # Extracting profile summary (or headline)
    profile_summary = soup.find('h2', class_='top-card-layout__headline')
    profile_summary_text = profile_summary.get_text().strip() if profile_summary else "No profile summary found"

    # Extracting profile picture URL

    return render_template('profile.html', 
                           profile_name=profile_name_text, 
                           title=title, 
                           description=description,
                           profile_summary=profile_summary_text,)

if __name__ == '__main__':
    app.run(debug=True)
