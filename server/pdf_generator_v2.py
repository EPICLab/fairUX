# pdf_generator_v2.py
from playwright.sync_api import sync_playwright
from jinja2 import Environment, FileSystemLoader
from datetime import datetime
import os
from typing import List, Dict, Any
import re
import tempfile
import base64

class ModernPDFGenerator:
    def __init__(self, output_path: str):
        self.output_path = output_path
        self.env = Environment(loader=FileSystemLoader('templates'))
        
    def _format_screenshot_name(self, filename: str) -> str:
        name = os.path.splitext(filename)[0]
        words = re.findall(r'[A-Z]?[a-z]+|[A-Z]{2,}(?=[A-Z][a-z]|\d|\W|$)|\d+', name.replace('_', ' '))
        return ' '.join(word.capitalize() for word in words)
    
    def _get_severity_styles(self, severity: str) -> Dict[str, str]:
        styles = {
            'High': {
                'bg_color': '#FEE2E2',
                'text_color': '#DC2626',
                'border_color': '#FECACA'
            },
            'Medium': {
                'bg_color': '#FFEDD5',
                'text_color': '#EA580C',
                'border_color': '#FED7AA'
            },
            'Low': {
                'bg_color': '#ECFCCB',
                'text_color': '#65A30D',
                'border_color': '#D9F99D'
            }
        }
        return styles.get(severity, {
            'bg_color': '#F3F4F6', 
            'text_color': '#4B5563',
            'border_color': '#E5E7EB'
        })

    def _encode_image_to_base64(self, image_path: str) -> str:
        try:
            with open(image_path, 'rb') as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode()
                return f"data:image/png;base64,{encoded_string}"
        except Exception as e:
            print(f"Error encoding image {image_path}: {str(e)}")
            return ""

    def generate_report(self, rules: List[Dict[str, Any]], analysis_results: List[Dict[str, Any]]):
        # Get absolute path for logo
        logo_path = os.path.abspath('logo.png')
        logo_base64 = self._encode_image_to_base64(logo_path) if os.path.exists(logo_path) else ""

        # Convert screenshot paths to base64
        for result in analysis_results:
            if 'screenshot_path' in result:
                result['screenshot_base64'] = self._encode_image_to_base64(result['screenshot_path'])
        
        template = self.env.get_template('report_template.html')
        template_data = {
            'date': datetime.now().strftime("%B %d, %Y"),
            'rules': rules,
            'results': analysis_results,
            'format_name': self._format_screenshot_name,
            'get_severity_styles': self._get_severity_styles,
            'logo_base64': logo_base64
        }
        
        html_content = template.render(**template_data)
        with tempfile.NamedTemporaryFile(suffix='.html', mode='w', delete=False) as f:
            f.write(html_content)
            temp_html_path = f.name

        try:
            with sync_playwright() as p:
                browser = p.chromium.launch()
                page = browser.new_page()
                page.goto(f'file://{temp_html_path}')
                page.wait_for_load_state('networkidle')
                page.pdf(path=self.output_path, format='A4', print_background=True, margin={
                    'top': '0.4in',
                    'right': '0.4in',
                    'bottom': '0.4in',
                    'left': '0.4in'
                })
                browser.close()
        finally:
            os.unlink(temp_html_path)

def generate_inclusivity_report(rules: List[Dict[str, Any]], 
                              analysis_results: List[Dict[str, Any]], 
                              output_path: str):
    generator = ModernPDFGenerator(output_path)
    generator.generate_report(rules, analysis_results)