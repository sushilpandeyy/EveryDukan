import 'package:url_launcher/url_launcher.dart';

Future<void> openUrl(String urlString) async {
  final Uri url = Uri.parse(urlString);
  try {
    if (!await launchUrl(url)) {
      throw Exception('Could not launch $urlString');
    }
  } catch (e) {
    print('Error launching URL: $e');
  }
}
