import { Component, createSignal } from 'solid-js';
import { Button, Card, Input, Form, FormSection, TextArea, Checkbox, Chart, CircularProgress, LineChart } from './components/core';
import { createThemeEffect } from './hooks';
import styles from './App.module.css';

const generateRandomData = (labels: string[]) => {
  return labels.map(label => ({ label, value: Math.floor(Math.random() * 100) + 1 }));
};

const App: Component = () => {
  const { isDarkMode, toggleTheme } = createThemeEffect();
  const [isSubscribed, setIsSubscribed] = createSignal(false);
  
  const [chartData, setChartData] = createSignal(generateRandomData(['A', 'B', 'C', 'D', 'E']));
  const [progressValue, setProgressValue] = createSignal(75);
  const [lineChartData, setLineChartData] = createSignal(generateRandomData(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']));

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <div
      class={`${styles.container} ${isDarkMode() ? 'dark-mode' : ''}`}
    >
      <header class={styles.header}>
        <h1>MetaMorph UI</h1>
        <Button
          variant="secondary"
          onClick={toggleTheme}
        >
          {isDarkMode() ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </Button>
      </header>

      <main class={styles.contentGrid}>
        <section>
          <h2>Buttons</h2>
          <div class={styles.buttonContainer}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </section>

        <section>
          <h2>Cards</h2>
          <h3>With 3D Tilt Effect</h3>
          <div class={styles.cardGrid}>
            <Card variant="elevated" interactive tilt>
              <h3>Interactive Card (with tilt)</h3>
              <div class="card-content">
                <p>This card has 3D tilt effect enabled. Hover and move your mouse to see the dynamic interaction.</p>
                <Button variant="primary">Learn More</Button>
              </div>
            </Card>
          </div>

          <h3 style={{ 'margin-top': '2rem' }}>Without 3D Tilt Effect</h3>
          <div class={styles.cardGrid}>
            <Card variant="elevated" interactive tilt={false}>
              <h3>Interactive Card (no tilt)</h3>
              <div class="card-content">
                <p>This card has the same hover effect but without 3D tilt interaction.</p>
                <Button variant="primary">Learn More</Button>
              </div>
            </Card>
          </div>

          <h3 style={{ 'margin-top': '2rem' }}>Other Variants</h3>
          <div class={styles.cardGrid}>
            <Card variant="outlined">
              <h3>Outlined Card</h3>
              <p>Simple outlined card design</p>
            </Card>
            <Card variant="filled">
              <h3>Filled Card</h3>
              <p>Card with background fill</p>
            </Card>
          </div>
        </section>

        <section>
          <h2>Data Visualization</h2>
          <div class={styles.cardGrid}>
            <Card variant="elevated">
              <h3>Bar Chart</h3>
              <Chart
                data={chartData()}
                title="Sample Bar Chart"
                description="Interactive bar chart with random data updates"
              />
              <Button onClick={() => setChartData(generateRandomData(['A', 'B', 'C', 'D', 'E']))}>
                Update Data
              </Button>
            </Card>

            <Card variant="elevated">
              <h3>Progress</h3>
              <div style={{ display: 'flex', 'justify-content': 'center', padding: '1rem' }}>
                <CircularProgress
                  value={progressValue()}
                  strokeWidth={10}
                  label="Completion"
                  animated
                />
              </div>
              <Button onClick={() => setProgressValue(Math.floor(Math.random() * 100))}>
                Update Progress
              </Button>
            </Card>

            <Card variant="elevated">
              <h3>Line Chart</h3>
              <LineChart
                data={lineChartData()}
                title="Monthly Trends"
                description="Interactive line chart with hover effects"
              />
              <Button onClick={() => setLineChartData(generateRandomData(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']))}>
                Update Line Chart
              </Button>
            </Card>
          </div>
        </section>

        <FormSection
          title="Interactive Forms"
          subtitle="Form elements with dynamic interactions and visual feedback enhance the user experience."
        >
          <Form onSubmit={handleSubmit}>
            <h3>Contact Form</h3>
            <Input
              placeholder="Your Name"
              type="text"
            />
            <Input
              placeholder="Your Email"
              type="email"
            />
            <Input
              placeholder="Subject"
              type="text"
            />
            <TextArea
              placeholder="Your Message"
              rows={4}
            />
            <Checkbox
              label="Subscribe to newsletter"
              checked={isSubscribed()}
              onChange={(e) => {console.log(isSubscribed());setIsSubscribed(e.currentTarget.checked)}}
            />
            <Button
              variant="primary"
              type="submit"
              style={{ 'margin-top': '1rem' }}
            >
              Send Message
            </Button>
          </Form>
        </FormSection>
      </main>
    </div>
  );
};

export default App;
