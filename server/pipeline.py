import pandas as pd
from BedrockClient import BedrockClient
import json
import base64
import mimetypes
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import os
from typing import List, Dict, Any
from pdf_generator_v2 import generate_inclusivity_report
from CacheClient import CacheClient, create_hash
import time

class InclusivityPipeline:
    def __init__(self):
        self.bedrock_client = BedrockClient()
        self.cache_client = CacheClient()
        self.styles = getSampleStyleSheet()
        
    def read_decision_rules(self, csv_path: str, persona) -> List[Dict[str, Any]]:
        csv_path = os.path.join(f"{persona.upper()}_{csv_path}")
        print("CSV_path:  " , csv_path)
        """Read and process decision rules from CSV file"""
        try:
            rules_df = pd.read_csv(csv_path)
            return rules_df.to_dict('records')
        except Exception as e:
            raise Exception(f"Error reading CSV file {csv_path}: {str(e)}")

    def encode_image_to_base64(self, image_path: str) -> str:
        """Convert image file to base64 string"""
        try:
            with open(image_path, 'rb') as image_file:
                # Read the image data
                image_data = image_file.read()
                
                # Get the MIME type
                mime_type, _ = mimetypes.guess_type(image_path)
                if not mime_type or not mime_type.startswith('image'):
                    mime_type = 'image/png'  # Default fallback
                
                # Encode to base64
                base64_string = base64.b64encode(image_data).decode('utf-8')
                
                # Return data URL format
                return f"data:{mime_type};base64,{base64_string}"
                
        except Exception as e:
            print(f"Error encoding image {image_path}: {str(e)}")
            return ""

    def get_abi_description(self) -> str:
        return """ We aim to find inclusivity bugs where you will act as the ABI. Here are the five facets information for ABI’s characteristics:
            - Motivations: Abi uses technologies to accomplish their tasks. They learn new technologies if and when they need to, but prefers to use methods they are already familiar and comfortable with, to keep their focus on the tasks they care about.
            - Computer Self-Efficacy: Abi has lower self-confidence than their peers about doing unfamiliar computing tasks. If problems arise with their technology, they often blame themselves for these problems. This affects whether and how they will persevere with a task if technology problems have arisen.
            - Attitude toward Risk: Abi's life is a little complicated and they rarely have spare time. So they are risk averse about using unfamiliar technologies that might need them to spend extra time on, even if the new features might be relevant. They instead perform tasks using familiar features, because they're more predictable about what they will get from them and how much time they will take.
            - Information Processing Style: Abi tends towards a comprehensive information processing style when they need to gather more information. So, instead of acting upon the first option that seems promising, they gather information comprehensively to try to form a complete understanding of the problem before trying to solve it. Thus, their style is "burst-y"; first they read a lot, then they act on it in a batch of activity.
            - Learning by Process vs. by Tinkering: When learning new technology, Abi leans toward process-oriented learning, e.g., tutorials, step-by-step processes, wizards, online how-to videos, etc. They don't particularly like learning by tinkering with software (i.e., just trying out new features or commands to see what they do), but when they do tinker, it has positive effects on their understanding of the software.
        """
    
    def get_tim_description(self) -> str:
        return """ We aim to find inclusivity bugs where you will act as the TIM. Here are the five facets information for TIM’s characteristics:
            - Motivations: Tim likes learning all the available functionality on all of his devices and computer systerms he uses, even when it may not be necessary to help his achieve his tasks. he sometimes finds himself exploring functions of one of his gadgets for so long that he loses sight of what he wanted to do with it to begin with.
            - Computer Self-Efficacy: Tim has high confidence in his abilities with technology, and thinks he's better than the average person at learning about new features. If he can't fix the problem, he blames it on the software vendor. It's not his fault if he can't get it to work.
            - Attitude toward Risk: Tim doesn't mind talking risks using features of technology that haven't been proven to work. When he is presented with challenges because he has tried a new way that doesn't work, it doesn't changes his attitudes toward technology.
            - Information Processing Style: Tim leans towards a selective information processing style or "depth first" approach. That is, he usually delves into the first promising option, pursues it, and if it doesn't work out he backs out and gathers a bit more information until he sees another option to try. Thus, his style is very incremental.
            - Learning by Process vs. by Tinkering: Whenever Tim uses new technology, he tries to construct his own understanding of how the software works internally. He likes tinkering and exploring the menu items and functions of the software in order to build that understanding. Sometimes he plays with features too much, losing focus on what he set out to do originally, 
            but this helps him gain better understanding of the software.
        """

    def get_facet_description(self, persona: str) -> str:
        if persona == "":
            persona = "ABI"
        persona = persona.upper()
        if persona == "ABI":
            return self.get_abi_description()
        elif persona == "TIM":
            return self.get_tim_description()
        return get_abi_description()

    def generate_rules_analysis(self, rules: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate comprehensive analysis for all rules at once"""
        try:
            rules_hash = create_hash(*[
                (rule.get('Rule Name', ''), rule.get('Description', ''), rule.get('Facet', ''), rule.get('Bug_Categories', ''))
                for rule in rules
            ])
            cached_analysis = self.cache_client.get_cached_data(rules_hash, 'rules_analysis')
            if cached_analysis:
                return cached_analysis

            prompt = f"""
            Analyze these inclusivity decision rules:
            Rules: {rules}
            
            For each rule, provide:
            1. What the rule checks for
            2. Common inclusivity bugs related to this rule
            3. Bug categories associated with this decision rule
            4. How to identify violations
            5. Impact on user experience
            
            Return a JSON array where each object has:
            - rule_id: ID of the rule
            - analysis: {{
                description: brief description,
                common_bugs: list of common issues,
                bug_categories: list of bug categories,
                identification: how to spot violations,
                impact: user experience impact
            }}
            """
            response = self.bedrock_client.call_claude(
                prompt=prompt,
                image_paths=[]  # No images for rule analysis
            )
            analysis = json.loads(response['response'])
            self.cache_client.set_cached_data(rules_hash, analysis, 'rules_analysis')


            '''
            {'rules':[
                {
                'rule_id':'DR1',
                    'analysis':{
                        'description':'Ensures prerequisites are visible before action buttons',
                        'common_bugs':[
                            'Hidden requirements revealed only after clicking',
                            'Missing system requirements',
                            'Unclear time commitments',
                            'Scattered prerequisite information'],
                        'bug_categories':['Lack of guidance about task', 'Privacy concerns'],
                        'identification':'Check if all requirements are visible before any interactive elements. Look for hidden information that only appears after user interaction.',
                        'impact':'Reduces user frustration and abandonment by setting clear expectations upfront. Particularly important for users with anxiety or time constraints.'
                    }
                },
            .....]
            }
            '''
            return analysis

        except Exception as e:
            raise Exception(f"Error generating rules analysis: {str(e)}")

    def analyze_screenshot(self, 
                         persona: str,   
                         image_path: str, 
                         rules_analysis: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze a screenshot for inclusivity bugs based on all rules"""
        try:
            # Extract just the filename from the path
            #image_filename = os.path.basename(image_path)
            image_filename = os.path.abspath(image_path)
            image_filename = image_filename.replace('\u202f', ' ')
            persona_description = self.get_facet_description(persona)
            
            prompt = f"""  
            {persona_description}
                      
            Analyze this screenshot for inclusivity bugs based on these rules:
            {rules_analysis}
            
            For each rule that has violations in the screenshot, provide:
            - rule_id: The ID of the violated rule
            - detected_bugs: List of specific issues found
            - bug_categories: Applicable bug categories in the associated rule that the detected bugs fall into
            - locations: Where in the UI each issue occurs
            - severity: Impact level (High/Medium/Low)
            - recommendations: How to fix each issue
            
            Return as a JSON object with this structure:
            {{
                "screenshot": screenshot filename,
                "violations": [
                    {{
                        "rule_id": "DR1",
                        "bugs": [
                            {{
                                "description": "Issue description",
                                "categories": "Bug categories specifically corresponding to the detected issue",
                                "location": "Where in UI",
                                "severity": "High/Medium/Low",
                                "recommendation": "How to fix"
                            }}
                        ]
                    }}
                ]
            }}
            """
            cache_key = create_hash(prompt, image_path)
            cached_analysis = self.cache_client.get_cached_data(cache_key, 'screenshot_analysis')
            if cached_analysis:
                return cached_analysis

            response = self.bedrock_client.call_claude(
                prompt=prompt,
                image_paths=[image_filename]
            )
            analysis = json.loads(response['response'])
            analysis['screenshot_name'] = image_filename
            analysis['screenshot_path'] = image_path
            analysis['screenshot_base64']= self.encode_image_to_base64(image_path)

            self.cache_client.set_cached_data(cache_key, analysis, 'screenshot_analysis')
            return analysis
            
            
        except Exception as e:
            raise Exception(f"Error analyzing screenshot {image_filename}: {str(e)}")

    def generate_report(self, 
                       rules: List[Dict[str, Any]], 
                       analysis_results: List[Dict[str, Any]], 
                       output_path: str):
        """Generate PDF report with screenshots and analysis"""
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        story = []

        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceAfter=12
        )

        # Title
        story.append(Paragraph("Inclusivity Analysis Report", title_style))
        story.append(Spacer(1, 12))

        # Create a rule lookup dictionary
        rule_lookup = {rule['Rule ID']: rule for rule in rules}

        for result in analysis_results:
            # Screenshot info
            story.append(Paragraph(f"Screenshot: {result['screenshot']}", heading_style))

            # Add screenshot image if available
            screenshot_path = os.path.join('screenshots', result['screenshot'])
            if os.path.exists(screenshot_path):
                img = Image(screenshot_path, width=6*inch, height=4*inch)
                story.append(img)
                story.append(Spacer(1, 12))

            # Process each violation
            for violation in result['violations']:
                rule = rule_lookup.get(violation['rule_id'], {})
                
                # Rule header with facet
                story.append(Paragraph(
                    f"Rule {rule.get('Rule ID', 'Unknown')}: {rule.get('Rule Name', 'Unknown')}",
                    heading_style
                ))
                story.append(Paragraph(f"Facet: {rule.get('facet', 'Unknown')}", self.styles['Normal']))
                story.append(Spacer(1, 12))

                # Create table for bugs
                if violation.get('bugs'):
                    data = [['Issue', 'Categories', 'Location', 'Severity', 'Recommendation']]
                    for bug in violation['bugs']:
                        data.append([
                            bug['description'],
                            bug['categories'],
                            bug['location'],
                            bug['severity'],
                            bug['recommendation']
                        ])
                    
                    table = Table(data, colWidths=[2*inch, 1.5*inch, 1*inch, 2.5*inch])
                    table.setStyle([
                        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                        ('FONTSIZE', (0, 0), (-1, 0), 14),
                        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
                        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                        ('FONTSIZE', (0, 1), (-1, -1), 12),
                        ('GRID', (0, 0), (-1, -1), 1, colors.black)
                    ])
                    story.append(table)
                
                story.append(Spacer(1, 20))

        doc.build(story)

    def run_pipeline(self, persona: str, rules_csv_path: str, screenshots_dir: str, output_path: str) -> List[Dict[str, Any]]:
        """Run the complete pipeline"""
        try:
            # Read rules
            rules = self.read_decision_rules(rules_csv_path, persona)
            time.sleep(5)
            
            # Generate comprehensive analysis for all rules
            rules_analysis = self.generate_rules_analysis(rules)
            #rules_analysis = {'rules': [{'rule_id': 'DR1', 'analysis': {'description': 'This rule ensures error messages are complete and actionable by requiring three key components: the error identification, cause explanation, and resolution steps', 'common_bugs': ['Vague error messages that only state an error occurred', "Technical jargon in error messages that users don't understand", 'Missing resolution steps or next actions', 'Blaming language that makes users feel at fault', 'Error messages that create anxiety or uncertainty'], 'identification': {'steps': ['Review all error messages in the interface', 'Check if each error message includes what went wrong', 'Verify the cause is clearly explained', 'Confirm specific resolution steps are provided', 'Test if messages make sense to non-technical users']}, 'impact': {'positive_outcomes': ['Reduces user frustration and anxiety', 'Increases user confidence in handling errors', 'Improves problem resolution success rate', 'Makes the system feel more supportive and helpful', 'Decreases support tickets and user abandonment'], 'negative_if_violated': ['Users feel lost and helpless when errors occur', 'Higher system abandonment rates', 'Increased support costs', 'Lower user satisfaction and trust', 'Higher cognitive load on users trying to resolve issues']}}}]}
            results = []
            already = {}
            # Process each screenshot
            screenshots_dir = self.bedrock_client.IMAGES_PATH + screenshots_dir
            for screenshot in os.listdir(screenshots_dir):
                if screenshot.lower().endswith(('.png', '.jpg', '.jpeg')):
                    screenshot_path = os.path.join(os.getcwd(), screenshots_dir, screenshot)
                    print(f"Processing screenshot: {screenshot_path}")
                    image_key = self.encode_image_to_base64(screenshot_path)
                    if image_key in already:
                        continue
                    else:
                        analysis = self.analyze_screenshot(persona, screenshot_path, rules_analysis)
                        results.append(analysis)
                        already[image_key] = True
            '''
            results = [
            {
                "screenshot": "sharing_progress_error.png",
                "screenshot_path": "/Users/ambareesh/Research/MOSIP/images/screenshots/Screenshot 2023-11-27 at 2.35.28 PM.png",
                "violations": [
                {
                    "rule_id": "DR1",
                    "facet": "Attitude towards risk",
                    "bugs": [
                    {
                        "description": "Error message lacks specific resolution steps for the user",
                        "categories": "Lack of guidance about task",
                        "location": "Error message text: 'It's taking longer than expected to share. There could be a problem with the connection.'",
                        "severity": "High",
                        "recommendation": "Add specific troubleshooting steps like: 'Please check your internet connection and try again. If the problem persists, you can: 1) Switch to a different network 2) Try sharing later 3) Contact support if issues continue'"
                    },
                    {
                        "description": "Vague error message that creates uncertainty",
                        "categories": "Lack of guidance about task",
                        "location": "Error message using phrases 'could be' and 'taking longer than expected'",
                        "severity": "Medium",
                        "recommendation": "Make the message more definitive and specific, e.g.: 'Unable to share due to slow or unstable internet connection' followed by clear next steps"
                    },
                    {
                        "description": "Single 'Cancel' action limits user options",
                        "categories": "Lack of guidance about task",
                        "location": "Bottom button showing only 'Cancel' option",
                        "severity": "Medium",
                        "recommendation": "Add multiple action options like 'Retry', 'Cancel', and 'Get Help' to give users more control over resolving the error"
                    }
                    ]
                }
                ]
            }
            ] '''
            #self.generate_report(rules, results, output_path)

            # # Filter out low severity bugs
            # for result in results:
            #     for violation in result.get('violations', []):
            #         # Only keep bugs with High or Medium severity
            #         if 'bugs' in violation:
            #             violation['bugs'] = [bug for bug in violation['bugs'] 
            #                                 if bug.get('severity', '').lower() in ['high', 'medium']]

            generate_inclusivity_report(rules, results, output_path)
            return results

        except Exception as e:
            raise Exception(f"Pipeline error: {str(e)}")


if __name__ == "__main__":
    pipeline = InclusivityPipeline()
    try:
        results = pipeline.run_pipeline(
            persona='ABI',
            rules_csv_path='Decision Rules.csv',
            screenshots_dir='screenshots',
            output_path='inclusivity_report.pdf'
        )
        print("Analysis completed successfully!")
    except Exception as e:
        print(f"Error running pipeline: {str(e)}")