import google.generativeai as genai
from flask import Flask, request, render_template, redirect, url_for

app = Flask(__name__)

GOOGLE_API_KEY = 'AIzaSyCarN4yxPKWw9UiiCVsx0H0c_MWJbHjLV8'  
genai.configure(api_key=GOOGLE_API_KEY)

messages = [
    {"role": "system", "content": "Hi I am Your helpful assistant!"}
]

# Dictionary with predefined responses
predefined_responses = {
    "What is Alumni Connect?": "Alumni Connect is a platform where alumni can network with each other and with current students. It offers opportunities for mentorship, career development, and giving back to the institution.",
    "How can I donate as an alumnus?": "You can make donations to directly shape a student’s future by providing the resources they need to succeed.",
    "What career opportunities are available for alumni": "Alumni can access job postings and career opportunities tailored specifically for the alumni network.",
    "How can I provide feedback": "You can provide feedback and participate in surveys to help shape the future of our alumni association.",
    "How do I stay updated on alumni events": "You can stay informed through updates on events, success stories, and career opportunities on the platform.",
    "how to i post a job in alumini portal": "You can post a job on the Alumni Connect platform by following these steps:\n\n1. **Log in to your Alumni Connect account.**\n2. **Navigate to the \"connect\" section.**\n3. **Click on \"Post a Job\" or \"Submit a Job Posting\".**\n4. **Fill out the required information, including job title, description, location, and qualifications.** Be sure to include any specific details that would be relevant to alumni, such as preferred experience or skills.",
    "How can I schedule a mentorship session?": "You can schedule a mentorship session through the platform by selecting an available mentor, entering your details, and confirming a time."
}

@app.route('/')
def index():
    return render_template('index.html', messages=messages)

@app.route('/send', methods=['POST'])
def send():
    user_message = request.form['message']
    if user_message:
        messages.append({"role": "user", "content": user_message})
        if user_message in predefined_responses:
            reply = predefined_responses[user_message]
        else:
            model = genai.GenerativeModel('gemini-pro')
            try:
                response = model.generate_content(user_message)
                reply = response.text
            except Exception as e:
                reply = f"Error: {str(e)}"
        messages.append({"role": "assistant", "content": reply})
    return redirect(url_for('index'))

@app.route('/clear')
def clear():
    global messages
    messages = [
        {"role": "system", "content": "Hi i am your helpful assistant!"}
    ]
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
