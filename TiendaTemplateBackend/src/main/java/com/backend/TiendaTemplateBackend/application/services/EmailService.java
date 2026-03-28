package com.backend.TiendaTemplateBackend.application.services;

import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantConfigService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender defaultMailSender;
    
    private final TenantConfigService tenantConfigService;

    @Value("${spring.mail.username:no-reply@tienda.com}")
    private String defaultFromAddress;

    @Value("${app.name:TiendaTemplate}")
    private String defaultAppName;

    public void sendPasswordResetEmail(String toEmail, String userName, String resetLink) {
        var configOpt = tenantConfigService.getCurrentConfig();
        
        String appName = configOpt.map(c -> c.getAppName()).orElse(defaultAppName);
        JavaMailSender mailSender = getMailSenderForTenant(configOpt.orElse(null));
        if (mailSender == null) {
            throw new RuntimeException("No se ha configurado ningún servidor de correo para la tienda '" + (configOpt.isPresent() ? configOpt.get().getPageCode() : "desconocida") + "' ni uno por defecto.");
        }
        
        String fromAddress = configOpt.map(c -> c.getMailUsername()).orElse(defaultFromAddress);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress, appName); // Muestra "Nombre de Tienda <email>"
            helper.setTo(toEmail);
            helper.setSubject("🔐 Restablece tu contraseña - " + appName);
            helper.setText(buildEmailHtml(userName, resetLink, appName), true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar el correo de recuperación.", e);
        }
    }

    private JavaMailSender getMailSenderForTenant(com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.TenantConfig config) {
        if (config == null || config.getMailHost() == null) {
            return defaultMailSender;
        }

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(config.getMailHost());
        mailSender.setPort(config.getMailPort());
        mailSender.setUsername(config.getMailUsername());
        mailSender.setPassword(config.getMailPassword());

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "false");

        return mailSender;
    }

    private String buildEmailHtml(String userName, String resetLink, String appName) {
        return """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Restablecer Contraseña</title>
                </head>
                <body style="margin:0;padding:0;background-color:#0f0f14;font-family:'Segoe UI',Arial,sans-serif;">
                
                  <!-- Wrapper -->
                  <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#0f0f14;padding:40px 0;">
                    <tr>
                      <td align="center">
                        <!-- Card -->
                        <table width="600" cellpadding="0" cellspacing="0"
                          style="max-width:600px;width:100%%;border-radius:20px;overflow:hidden;
                                 box-shadow:0 25px 60px rgba(0,0,0,0.5);">
                
                          <!-- Header con banner degradado -->
                          <tr>
                            <td align="center"
                              style="background:linear-gradient(135deg,#6c3de8 0%%,#a855f7 50%%,#ec4899 100%%);
                                     padding:48px 40px 36px;">
                              <!-- Icono -->
                              <div style="width:80px;height:80px;border-radius:50%%;
                                          background:rgba(255,255,255,0.15);
                                          display:inline-block;text-align:center;line-height:80px;
                                          margin-bottom:20px;font-size:36px;">
                                🔐
                              </div>
                              <br/>
                              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;
                                         letter-spacing:-0.5px;text-shadow:0 2px 8px rgba(0,0,0,0.2);">
                                ¿Olvidaste tu contraseña?
                              </h1>
                              <p style="margin:10px 0 0;color:rgba(255,255,255,0.85);font-size:16px;">
                                No te preocupes, te ayudamos a recuperarla.
                              </p>
                            </td>
                          </tr>
                
                          <!-- Body -->
                          <tr>
                            <td style="background:#1a1a2e;padding:40px 40px 32px;">
                              <p style="margin:0 0 8px;color:#a0aec0;font-size:14px;text-transform:uppercase;
                                         letter-spacing:1.5px;font-weight:600;">
                                Hola,
                              </p>
                              <h2 style="margin:0 0 20px;color:#e2e8f0;font-size:22px;font-weight:600;">
                                %s
                              </h2>
                              <p style="margin:0 0 28px;color:#94a3b8;font-size:15px;line-height:1.7;">
                                Recibimos una solicitud para restablecer la contraseña de tu cuenta.
                                Haz clic en el botón de abajo para crear una nueva contraseña.
                                Este enlace <strong style="color:#c084fc;">expirará en 30 minutos</strong>.
                              </p>
                
                              <!-- Botón CTA -->
                              <table width="100%%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                                <tr>
                                  <td align="center">
                                    <a href="%s"
                                       style="display:inline-block;
                                              background:linear-gradient(135deg,#6c3de8,#a855f7);
                                              color:#ffffff;
                                              text-decoration:none;
                                              padding:16px 40px;
                                              border-radius:50px;
                                              font-size:16px;
                                              font-weight:700;
                                              letter-spacing:0.5px;
                                              box-shadow:0 8px 24px rgba(168,85,247,0.4);">
                                      Restablecer Contraseña →
                                    </a>
                                  </td>
                                </tr>
                              </table>
                
                              <!-- Divider -->
                              <hr style="border:none;border-top:1px solid #2d2d44;margin:0 0 24px;" />
                
                              <!-- Link fallback -->
                              <p style="margin:0 0 8px;color:#64748b;font-size:13px;">
                                Si el botón no funciona, copia y pega este enlace en tu navegador:
                              </p>
                              <p style="margin:0;word-break:break-all;">
                                <a href="%s"
                                   style="color:#a855f7;font-size:13px;text-decoration:none;">
                                  %s
                                </a>
                              </p>
                            </td>
                          </tr>
                
                          <!-- Info box -->
                          <tr>
                            <td style="background:#16162a;padding:20px 40px;">
                              <table width="100%%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="background:#1e1e38;border-left:3px solid #6c3de8;
                                              border-radius:8px;padding:14px 18px;">
                                    <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
                                      ⚠️ <strong style="color:#c084fc;">Importante:</strong>
                                      Si no solicitaste este cambio, puedes ignorar este correo.
                                      Tu contraseña actual permanecerá sin cambios.
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                
                          <!-- Footer -->
                          <tr>
                            <td align="center"
                              style="background:#111120;padding:24px 40px;border-top:1px solid #1e1e38;">
                              <p style="margin:0 0 6px;color:#4a5568;font-size:12px;">
                                © 2025 %s · Todos los derechos reservados
                              </p>
                              <p style="margin:0;color:#374151;font-size:11px;">
                                Este correo fue generado automáticamente, por favor no respondas a él.
                              </p>
                            </td>
                          </tr>
                
                        </table>
                      </td>
                    </tr>
                  </table>
                
                </body>
                </html>
                """.formatted(userName, resetLink, resetLink, resetLink, appName);
    }
}
