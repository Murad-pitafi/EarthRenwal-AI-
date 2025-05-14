import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ESP32CamSetupPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">ESP32-CAM Setup Guide</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>ESP32-CAM Configuration</CardTitle>
          <CardDescription>Follow these steps to set up your ESP32-CAM for use with EarthRenewal AI</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="code">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="code">Arduino Code</TabsTrigger>
              <TabsTrigger value="hardware">Hardware Setup</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="mt-4">
              <h3 className="text-lg font-medium mb-4">Arduino Code for ESP32-CAM</h3>
              <p className="mb-4">
                Copy the code below and paste it into your Arduino IDE. Make sure to replace the WiFi credentials with
                your own.
              </p>

              <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[500px]">
                <pre className="text-sm">
                  {`
#include "esp_camera.h"
#include <WiFi.h>
#include "esp_timer.h"
#include "img_converters.h"
#include "Arduino.h"
#include "fb_gfx.h"
#include "soc/soc.h" //disable brownout problems
#include "soc/rtc_cntl_reg.h"  //disable brownout problems
#include "esp_http_server.h"

//Replace with your network credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

#define PART_BOUNDARY "123456789000000000000987654321"

// This project was tested with the AI Thinker Model
#define CAMERA_MODEL_AI_THINKER

#if defined(CAMERA_MODEL_AI_THINKER)
  #define PWDN_GPIO_NUM     32
  #define RESET_GPIO_NUM    -1
  #define XCLK_GPIO_NUM      0
  #define SIOD_GPIO_NUM     26
  #define SIOC_GPIO_NUM     27
  
  #define Y9_GPIO_NUM       35
  #define Y8_GPIO_NUM       34
  #define Y7_GPIO_NUM       39
  #define Y6_GPIO_NUM       36
  #define Y5_GPIO_NUM       21
  #define Y4_GPIO_NUM       19
  #define Y3_GPIO_NUM       18
  #define Y2_GPIO_NUM        5
  #define VSYNC_GPIO_NUM    25
  #define HREF_GPIO_NUM     23
  #define PCLK_GPIO_NUM     22
#else
  #error "Camera model not selected"
#endif

static const char* _STREAM_CONTENT_TYPE = "multipart/x-mixed-replace;boundary=" PART_BOUNDARY;
static const char* _STREAM_BOUNDARY = "\\r\\n--" PART_BOUNDARY "\\r\\n";
static const char* _STREAM_PART = "Content-Type: image/jpeg\\r\\nContent-Length: %u\\r\\n\\r\\n";

httpd_handle_t stream_httpd = NULL;

static esp_err_t stream_handler(httpd_req_t *req){
  camera_fb_t * fb = NULL;
  esp_err_t res = ESP_OK;
  size_t _jpg_buf_len = 0;
  uint8_t * _jpg_buf = NULL;
  char * part_buf[64];

  res = httpd_resp_set_type(req, _STREAM_CONTENT_TYPE);
  if(res != ESP_OK){
    return res;
  }

  while(true){
    fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Camera capture failed");
      res = ESP_FAIL;
    } else {
      if(fb->width > 400){
        if(fb->format != PIXFORMAT_JPEG){
          bool jpeg_converted = frame2jpg(fb, 80, &_jpg_buf, &_jpg_buf_len);
          esp_camera_fb_return(fb);
          fb = NULL;
          if(!jpeg_converted){
            Serial.println("JPEG compression failed");
            res = ESP_FAIL;
          }
        } else {
          _jpg_buf_len = fb->len;
          _jpg_buf = fb->buf;
        }
      }
    }
    if(res == ESP_OK){
      size_t hlen = snprintf((char *)part_buf, 64, _STREAM_PART, _jpg_buf_len);
      res = httpd_resp_send_chunk(req, (const char *)part_buf, hlen);
    }
    if(res == ESP_OK){
      res = httpd_resp_send_chunk(req, (const char *)_jpg_buf, _jpg_buf_len);
    }
    if(res == ESP_OK){
      res = httpd_resp_send_chunk(req, _STREAM_BOUNDARY, strlen(_STREAM_BOUNDARY));
    }
    if(fb){
      esp_camera_fb_return(fb);
      fb = NULL;
      _jpg_buf = NULL;
    } else if(_jpg_buf){
      free(_jpg_buf);
      _jpg_buf = NULL;
    }
    if(res != ESP_OK){
      break;
    }
  }
  return res;
}

void startCameraServer(){
  httpd_config_t config = HTTPD_DEFAULT_CONFIG();
  config.server_port = 80;

  httpd_uri_t index_uri = {
    .uri       = "/",
    .method    = HTTP_GET,
    .handler   = stream_handler,
    .user_ctx  = NULL
  };
  
  if (httpd_start(&stream_httpd, &config) == ESP_OK) {
    httpd_register_uri_handler(stream_httpd, &index_uri);
  }
}

void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); //disable brownout detector
 
  Serial.begin(115200);
  Serial.setDebugOutput(false);
  
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG; 
  
  if(psramFound()){
    config.frame_size = FRAMESIZE_VGA; // Reduced from UXGA for better streaming
    config.jpeg_quality = 12;  // Reduced quality for better streaming
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }
  
  // Camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }
  
  // Wi-Fi connection
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  
  Serial.print("Camera Stream Ready! Go to: http://");
  Serial.print(WiFi.localIP());
  
  // Start streaming web server
  startCameraServer();
}

void loop() {
  delay(1);
}
                  `}
                </pre>
              </div>

              <h4 className="text-md font-medium mt-6 mb-2">Important Notes:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Replace <code>YOUR_WIFI_SSID</code> and <code>YOUR_WIFI_PASSWORD</code> with your actual WiFi
                  credentials
                </li>
                <li>
                  Select <strong>AI Thinker ESP32-CAM</strong> as your board in the Arduino IDE
                </li>
                <li>Connect GPIO 0 to GND when uploading the code, then disconnect it for normal operation</li>
                <li>The ESP32-CAM will print its IP address to the Serial Monitor when it connects to WiFi</li>
              </ul>
            </TabsContent>

            <TabsContent value="hardware" className="mt-4">
              <h3 className="text-lg font-medium mb-4">Hardware Setup</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Components Needed:</h4>
                  <ul className="list-disc pl-6">
                    <li>ESP32-CAM module</li>
                    <li>FTDI programmer or USB-to-TTL converter</li>
                    <li>Breadboard and jumper wires</li>
                    <li>5V power supply</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Wiring for Programming:</h4>
                  <ul className="list-disc pl-6">
                    <li>Connect ESP32-CAM GND to FTDI GND</li>
                    <li>Connect ESP32-CAM 5V to FTDI VCC (5V)</li>
                    <li>Connect ESP32-CAM U0R (GPIO3) to FTDI TX</li>
                    <li>Connect ESP32-CAM U0T (GPIO1) to FTDI RX</li>
                    <li>Connect ESP32-CAM GPIO0 to GND (only during programming)</li>
                    <li>Press the reset button on the ESP32-CAM after connecting GPIO0 to GND</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Wiring for Normal Operation:</h4>
                  <ul className="list-disc pl-6">
                    <li>Disconnect GPIO0 from GND</li>
                    <li>Keep the power connections (GND and 5V)</li>
                    <li>Press the reset button to restart the ESP32-CAM</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium text-blue-700">Power Requirements:</h4>
                  <p className="text-blue-700">
                    The ESP32-CAM requires a stable 5V power supply capable of providing at least 500mA. Insufficient
                    power can cause the camera to malfunction or reset during operation.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="troubleshooting" className="mt-4">
              <h3 className="text-lg font-medium mb-4">Troubleshooting</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium">Camera Not Connecting:</h4>
                  <ul className="list-disc pl-6">
                    <li>Verify the ESP32-CAM is powered correctly with 5V</li>
                    <li>Check that the ESP32-CAM is connected to your WiFi network</li>
                    <li>Ensure you're using the correct IP address in the app</li>
                    <li>Try restarting the ESP32-CAM by pressing the reset button</li>
                    <li>Make sure your device and the ESP32-CAM are on the same network</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Poor Image Quality:</h4>
                  <ul className="list-disc pl-6">
                    <li>Adjust the camera position and focus by turning the lens</li>
                    <li>Ensure adequate lighting in the field area</li>
                    <li>
                      Try modifying the <code>config.frame_size</code> and <code>config.jpeg_quality</code> values in
                      the code
                    </li>
                    <li>Clean the camera lens if it's dusty or dirty</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Camera Resets or Disconnects:</h4>
                  <ul className="list-disc pl-6">
                    <li>Use a more stable power supply (at least 5V/1A)</li>
                    <li>Add a large capacitor (470-1000μF) between VCC and GND</li>
                    <li>Reduce the frame size or quality to decrease power consumption</li>
                    <li>Check for overheating and provide better ventilation if needed</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Finding the ESP32-CAM IP Address:</h4>
                  <ul className="list-disc pl-6">
                    <li>Check the Serial Monitor in Arduino IDE after uploading the code</li>
                    <li>Look for connected devices in your router's admin panel</li>
                    <li>Use a network scanner app to find all devices on your network</li>
                    <li>Try accessing common IP addresses like 192.168.1.x or 192.168.0.x</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-md">
                  <h4 className="font-medium text-yellow-800">Common Error: Brown-out Reset</h4>
                  <p className="text-yellow-800">
                    If the ESP32-CAM keeps restarting, it might be experiencing brown-out resets due to insufficient
                    power. The code already disables the brown-out detector, but you should still ensure a stable power
                    supply.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Testing Your ESP32-CAM</CardTitle>
            <CardDescription>How to verify your ESP32-CAM is working correctly</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-6 space-y-2">
              <li>After uploading the code and powering the ESP32-CAM, note the IP address from the Serial Monitor</li>
              <li>
                Open a web browser and enter the IP address (e.g., <code>http://192.168.1.100</code>)
              </li>
              <li>You should see a live video stream from the camera</li>
              <li>If the stream works in your browser, the ESP32-CAM is configured correctly</li>
              <li>Enter this IP address in the Camera Settings tab in our app</li>
            </ol>

            <div className="mt-4 p-4 bg-green-50 rounded-md">
              <p className="text-green-700">
                <strong>Tip:</strong> For better reliability, consider assigning a static IP address to your ESP32-CAM
                through your router's settings.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrating with EarthRenewal AI</CardTitle>
            <CardDescription>How to connect your ESP32-CAM to the application</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Go to the Field Camera page in the EarthRenewal AI application</li>
              <li>Click on the Settings tab</li>
              <li>
                Enter your ESP32-CAM's IP address (e.g., <code>192.168.43.105</code>)
              </li>
              <li>Click "Connect" to establish a connection to your camera</li>
              <li>If successful, you'll see the live stream from your ESP32-CAM</li>
              <li>You can now take snapshots and monitor your field remotely</li>
            </ol>

            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-blue-700">
                <strong>Note:</strong> Make sure your device and the ESP32-CAM are on the same network. The camera
                stream is not accessible from the internet unless you set up port forwarding on your router.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
